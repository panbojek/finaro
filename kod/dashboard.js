
'use strict';
let TODAY='',START='';
const products=[];
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:2}).format(n);
const pct=n=>new Intl.NumberFormat('pl-PL',{style:'percent',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const date=s=>new Date(s+'T12:00:00Z').toLocaleDateString('pl-PL',{timeZone:'UTC'}),sign=n=>n>0?'+':'';
const signedMoney=n=>sign(n)+money(n),tone=n=>n<0?'negative':'positive';
const safeUrl=s=>{try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
const filters={type:'',sector:''};let period='all',chartMode='profit',barMode='types',detailId=null,toastTimer,editingProductId=null,pendingDeleteId=null;
function notify(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,6500)}
function buildFilters(){
 $('#filterRow').innerHTML='';
 for(const [key,label] of [['type','Typ aktywa'],['sector','Branża / profil']]){
  const values=[...new Set(products.map(p=>p[key]))];
  const div=document.createElement('div');div.className='filter';
  div.innerHTML=`<label for="filter-${key}">${label}</label><select id="filter-${key}"><option value="">Wszystkie</option>${values.map(v=>`<option value="${esc(v)}" ${filters[key]===v?'selected':''}>${esc(v)}</option>`).join('')}</select>`;
  div.addEventListener('change',e=>{filters[key]=e.target.value;render()});$('#filterRow').append(div);
 }
 $('#periodControl').innerHTML='';const div=document.createElement('div');div.className='filter';div.innerHTML='<label for="period">Okres historii</label><select id="period"><option value="month">Miesiąc</option><option value="quarter">Kwartał</option><option value="year">Rok</option><option value="all">Cały okres</option></select>';$('#periodControl').append(div);
 $('#period').value=period;$('#period').addEventListener('change',()=>{period=$('#period').value;render()});
}
function dateRange(){if(period==='all')return {from:START,to:TODAY};const end=new Date(TODAY+'T12:00:00Z'),start=new Date(end),months=period==='month'?1:period==='quarter'?3:12;start.setUTCDate(1);start.setUTCMonth(start.getUTCMonth()-months);const last=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+1,0)).getUTCDate();start.setUTCDate(Math.min(end.getUTCDate(),last));return {from:[START,start.toISOString().slice(0,10)].sort().pop(),to:TODAY}}
function valueAt(p,d){return d<p.added?null:p.value}
function selected(){return products.filter(p=>Object.entries(filters).every(([k,value])=>!value||p[k]===value))}
function manualValuationAge(p,asOf=TODAY){if(p.auto)return null;const when=Date.parse(p.updated+'T00:00:00Z'),now=Date.parse(asOf+'T00:00:00Z');return Number.isFinite(when)&&Number.isFinite(now)?Math.max(0,Math.floor((now-when)/86400000)):null}
function needsManualValuationUpdate(p,asOf=TODAY){return !p.auto&&(manualValuationAge(p,asOf)===null||manualValuationAge(p,asOf)>=14)}
function valuationReminderMarkup(p){if(!needsManualValuationUpdate(p))return '';const age=manualValuationAge(p);return `<button class="valuation-reminder" data-detail="${p.id}" data-focus-valuation="true" aria-label="Zaktualizuj wycenę ${esc(p.name)}">⚠ Zaktualizuj wycenę · ${age===null?'brak daty':age+' dni'}</button>`}
function valuationNotice(p){if(!needsManualValuationUpdate(p))return '';const age=manualValuationAge(p);return `<div class="valuation-notice"><strong>Wycena wymaga aktualizacji.</strong> ${age===null?'Brakuje daty ostatniej wyceny.':'Od ostatniej wyceny minęło '+age+' dni.'} Zapisz aktualną wartość — również wtedy, gdy kwota się nie zmieniła.</div>`}
function barEntries(items){
 if(barMode==='products')return items.map(p=>({name:p.name,account:p.account,value:p.value,color:assetColors[p.type]||'#546e7a'})).sort((a,b)=>b.value-a.value);
 const grouped={};for(const p of items)grouped[p.type]=(grouped[p.type]||0)+p.value;
 return Object.entries(grouped).map(([name,value])=>({name,account:'',value,color:assetColors[name]||'#546e7a'})).sort((a,b)=>b.value-a.value);
}
function renderValueBars(items){
 const entries=barEntries(items),max=Math.max(1,...entries.map(a=>a.value));
 $('#valueBars').innerHTML=entries.map(a=>`<div class="value-bar-row"><div class="value-bar-label"><span class="value-bar-name" title="${esc(a.name)}">${esc(a.name)}</span><strong class="value-bar-amount">${money(a.value)}</strong></div>${a.account?`<span class="value-bar-account">${esc(a.account)}</span>`:''}<div class="value-bar-track" aria-hidden="true"><span style="width:${a.value/max*100}%;background:${a.color}"></span></div></div>`).join('')||'<div class="empty">Brak produktów dla wybranych filtrów.</div>';
}
const assetColors={'ETF-y':'#5c6bc0','Obligacje':'#ef8b2c','Portfel zarządzany':'#ab47bc','Gotówka':'#78909c','Akcje':'#0097a7'};
function seriesColor(items){const types=[...new Set(items.map(p=>p.type))];return types.length===1?(assetColors[types[0]]||'#546e7a'):'#546e7a'}
function historySeries(items,from,to,mode=chartMode){
 const ids=new Set(items.map(p=>p.id)),isWhole=items===products,daily=new Map();
 for(const h of appState.history){if(h.date<=to)daily.set(h.date,h)}
 return [...daily.values()].filter(h=>h.date>=from).map(h=>{const a=isWhole?h.assets:h.assets.filter(p=>ids.has(p.id)),v=a.reduce((s,p)=>s+p.value,0),c=a.reduce((s,p)=>s+p.capital,0);return {d:h.date,y:mode==='profit'?(c>0?(v-c)/c:null):v,active:a.length}}).filter(p=>p.active&&p.y!==null);
}
function chartHTML(items,from,to,chartId='portfolio'){
 const color=seriesColor(items),gradientId='fade-'+chartId,span=(Date.parse(to)-Date.parse(from))/86400000;
 const series=historySeries(items,from,to),format=n=>chartMode==='profit'?sign(n)+pct(n):money(n);
 if(!series.length)return '<div class="empty">Brak historii dla wybranego zakresu.</div>';
 let lo=Math.min(...series.map(p=>p.y)),hi=Math.max(...series.map(p=>p.y));const padding=Math.max((hi-lo)*.2,Math.abs(hi)*.008,chartMode==='profit'?.002:1);lo-=padding;hi+=padding;
 const x=p=>64+(span?(Date.parse(p.d)-Date.parse(from))/(span*86400000):.5)*510,y=n=>184-(n-lo)/(hi-lo)*156;
 const points=series.map(p=>`${x(p)},${y(p.y)}`).join(' '),last=series[series.length-1];
 let svg=`<svg class="chart" viewBox="0 0 600 240" role="group" aria-label="${chartMode==='value'?'Wartość':'Wynik procentowy'} ${chartId==='portfolio'?'całego portfela':'produktu'} od ${date(from)} do ${date(to)}. Zapisane wyceny."><defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity=".02"/></linearGradient></defs>`;
 for(let i=0;i<4;i++){const n=lo+(hi-lo)*i/3,yy=y(n),tick=chartMode==='profit'?new Intl.NumberFormat('pl-PL',{style:'percent',maximumFractionDigits:1}).format(n):new Intl.NumberFormat('pl-PL',{notation:'compact',maximumFractionDigits:1}).format(n);svg+=`<line x1="64" x2="574" y1="${yy}" y2="${yy}" stroke="#e5e8ec" stroke-dasharray="3 5"/><text x="55" y="${yy+4}" text-anchor="end">${tick}</text>`}
 svg+=`<polygon points="${x(series[0])},184 ${points} ${x(last)},184" fill="url(#${gradientId})"/><polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
 svg+=`<circle cx="${x(last)}" cy="${y(last.y)}" r="4" fill="${color}" stroke="white" stroke-width="2"/>`;
 series.forEach((p,i)=>{const label=esc(`${date(p.d)}\n${format(p.y)}`);svg+=`<circle cx="${x(p)}" cy="${y(p.y)}" r="8" fill="transparent" tabindex="${i===0||i===series.length-1?'0':'-1'}" role="img" aria-label="${label}" data-chart-label="${label}"/>`});
 svg+=`<text x="574" y="16" text-anchor="end" style="fill:${color};font-weight:600">${chartMode==='profit'?'Ostatni wynik':'Ostatnia wartość'}: ${format(last.y)}</text><text x="64" y="226">${date(from)}</text><text x="574" y="226" text-anchor="end">${date(to)}</text></svg>`;return svg;
}
function allocationHTML(groups,total){
 if(total<=0)return '<div class="allocation-empty">Brak wartości do pokazania na wykresie.</div>';
 const entries=Object.entries(groups).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
 const palette=assetColors;
 const description=entries.map(([k,v])=>`${k}: ${pct(v/total)}`).join(', ');
 let angle=-Math.PI/2;
 const slices=entries.map(([k,v])=>{const share=v/total,next=angle+share*Math.PI*2,color=palette[k]||'#546e7a',label=esc(`${k}\n${money(v)} · ${pct(share)}`),attrs=`data-pie-label="${label}" tabindex="0" role="img" aria-label="${label}"`;let shape;
  if(entries.length===1)shape=`<circle cx="110" cy="110" r="98" fill="${color}" ${attrs}></circle>`;
  else shape=`<path d="M 110 110 L ${110+98*Math.cos(angle)} ${110+98*Math.sin(angle)} A 98 98 0 ${share>.5?1:0} 1 ${110+98*Math.cos(next)} ${110+98*Math.sin(next)} Z" fill="${color}" stroke="white" stroke-width="2" ${attrs}></path>`;
  angle=next;return shape;
 }).join('');
 return `<svg class="pie-chart" viewBox="0 0 220 220" role="group" aria-label="Struktura portfela według wartości. ${esc(description)}">${slices}</svg><div class="allocation-legend">${entries.map(([k,v])=>`<div class="allocation-legend-row"><span class="allocation-dot" style="background:${palette[k]||'#546e7a'}" aria-hidden="true"></span><span>${esc(k)}</span><strong>${pct(v/total)}</strong></div>`).join('')}</div>`;
}
function hidePieTooltip(){$('#pieTooltip').hidden=true}
function bindValueTooltips(){
 hidePieTooltip();
 document.querySelectorAll('[data-pie-label],[data-chart-label]').forEach(slice=>{
  if(slice.dataset.tooltipBound)return;slice.dataset.tooltipBound='true';
  const show=e=>{const tip=$('#pieTooltip');tip.textContent=slice.dataset.pieLabel||slice.dataset.chartLabel;tip.hidden=false;const rect=slice.getBoundingClientRect(),x=Number.isFinite(e.clientX)?e.clientX:rect.left+rect.width/2,y=Number.isFinite(e.clientY)?e.clientY:rect.top+rect.height/2;const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.left=Math.max(12,Math.min(x+14,window.innerWidth-w-12))+'px';tip.style.top=Math.max(12,y+h+20>window.innerHeight?y-h-12:y+16)+'px'};
  slice.addEventListener('pointerenter',show);slice.addEventListener('pointermove',show);slice.addEventListener('pointerleave',hidePieTooltip);slice.addEventListener('focus',show);slice.addEventListener('blur',hidePieTooltip);slice.addEventListener('click',show);
 });
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')hidePieTooltip()});
document.addEventListener('click',e=>{if(!e.target.closest('[data-pie-label],[data-chart-label]'))hidePieTooltip()});
function render(){
 const {from,to}=dateRange();
 const chosen=selected(),items=chosen.filter(p=>p.added<=to),total=items.reduce((s,p)=>s+valueAt(p,to),0),capital=items.reduce((s,p)=>s+p.capital,0),gain=total-capital;
 $('#scope').textContent=`${Object.values(filters).some(Boolean)?'Wybrana część portfela':'Cały portfel'} · ${items.length} z ${products.length} produktów`;
 $('#asof').textContent=`Stan na ${date(to)} · wynik względem kapitału`;
 $('#total').textContent=money(total);$('#profit').textContent=signedMoney(gain);$('#profit').className='big '+tone(gain);$('#return').textContent=capital?sign(gain)+pct(gain/capital):'—';$('#return').className='big '+tone(gain);
 $('#chartRange').textContent=`${date(from)} – ${date(to)} · syntetyczna historia demonstracyjna`;
 renderValueBars(items);$('#chart').innerHTML=chartHTML(products,from,to);$('#chartLegend').setAttribute('style','--series-color:'+seriesColor(products));$('#chartLegend').textContent='Zawsze cały portfel · '+(chartMode==='value'?'wartość w PLN':'wynik (%) względem kapitału · nie w skali roku');
 const groups={};for(const p of items)groups[p.type]=(groups[p.type]||0)+valueAt(p,to);
 $('#allocation').innerHTML=allocationHTML(groups,total);
 bindValueTooltips();
 $('#count').textContent=`(${items.length})`;$('#empty').hidden=!!items.length;
 $('#rows').innerHTML=items.map(p=>{const v=valueAt(p,to),g=v-p.capital,url=safeUrl(p.url);return `<tr><td><div class="product-cell"><span class="asset-icon">${esc(p.type==='ETF-y'?'ETF':p.type==='Obligacje'?'OBL':p.type==='Akcje'?'AKC':p.type==='Portfel zarządzany'?'P':'PLN')}</span><div><button class="product-button" data-detail="${p.id}">${esc(p.name)}</button><div class="product-meta">${esc(p.symbol||p.sector)}</div></div></div></td><td>${esc(p.account)}</td><td class="number">${money(v)}</td><td class="number ${tone(g)}">${signedMoney(g)}</td><td class="number ${tone(g)}">${p.capital?sign(g)+pct(g/p.capital):'—'}</td><td><span class="badge ${p.auto?'':'manual'}">${p.auto?'Demo':'Ręczna'}</span><div class="product-meta">${date(p.updated)}</div>${p.auto&&!p.quote?'<span class="footnote">Czeka na symulację · ostatnia wartość wpisana</span>':''}${valuationReminderMarkup(p)}</td><td>${url?`<a class="external" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="Informacje o ${esc(p.name)} — nowa karta">Informacje ↗</a>`:'<span class="muted">Brak linku</span>'}</td><td><div class="row-actions"><button data-edit="${p.id}" aria-label="Edytuj ${esc(p.name)}">Edytuj</button></div></td></tr>`}).join('');
 document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>showDetail(Number(b.dataset.detail),b.dataset.focusValuation==='true')));
 document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openProductForm(Number(b.dataset.edit))));

}
