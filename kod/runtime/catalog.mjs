import fixture from '../../demo/portfolio.json' with {type:'json'};
export const catalog=fixture.catalog;
export const day = (now=new Date()) => new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Warsaw'}).format(now);
export const round = n => Math.round((n+Number.EPSILON)*100)/100;
export function emptyState(){ return {version:1,revision:0,products:[],history:[],alerts:[],watch:[],rules:{reports:true,price:true,threshold:5,frequency:'daily'},quotes:{},attempts:{},fx:{},reportIds:[],reportScan:null,reportError:null,quota:null,hasKey:false}; }
export function validDate(value){return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
export function productFields(input){
 const text=(key,max,required=false)=>{const v=String(input[key]??'').trim();if(v.length>max||(required&&!v))throw Error('Uzupełnij nazwę i konto; skróć zbyt długie pola.');return v;};
 const p={name:text('name',90,true),account:text('account',60,true),type:text('type',30),sector:text('sector',60),symbol:text('symbol',100),url:text('url',1000),purchaseDate:input.purchaseDate||null,capital:Number(input.capital),value:Number(input.value),auto:input.auto===true,quantity:input.quantity==null||input.quantity===''?null:Number(input.quantity)};
 if(p.type==='Portu')p.type='Portfel zarządzany'; // Compatibility with earlier demo saves.
 if(!['Akcje','ETF-y','Obligacje','Portfel zarządzany','Gotówka'].includes(p.type))throw Error('Nieprawidłowy typ aktywa.');
 if(!Number.isFinite(p.capital)||p.capital<=0||p.capital>1e12||!Number.isFinite(p.value)||p.value<0||p.value>1e12)throw Error('Podaj dodatni kapitał i nieujemną wartość do 1 biliona PLN.');
 if(p.url){try{if(!['https:','http:'].includes(new URL(p.url).protocol))throw 0;}catch{throw Error('Podaj poprawny link https:// lub http://.');}}
 if(p.purchaseDate&&(!validDate(p.purchaseDate)||p.purchaseDate>day()))throw Error('Sprawdź datę pierwszego zakupu.');
 const instrument=catalog.find(c=>c.symbol===p.symbol);
 if(p.auto&&(!instrument||instrument.type!==p.type||!Number.isFinite(p.quantity)||p.quantity<=0||p.quantity>1e12))throw Error('Dla automatu wybierz instrument z katalogu i podaj liczbę jednostek.');
 if(p.quantity!==null&&(!Number.isFinite(p.quantity)||p.quantity<0||p.quantity>1e12))throw Error('Sprawdź liczbę jednostek.');
 return p;
}
export function snapshot(s,reason,now=new Date()){
 const entry={at:now.toISOString(),date:day(now),reason,assets:s.products.map(p=>({id:p.id,value:p.value,capital:p.capital,updated:p.updated}))};
 s.history.push(entry); return entry;
}
export function series(history,from,to,mode='profit',id=null){
 const daily=new Map();for(const h of history){if(h.date>to)continue;daily.set(h.date,h);}
 return [...daily.values()].filter(h=>h.date>=from).map(h=>{const a=id===null?h.assets:h.assets.filter(p=>p.id===id);const v=a.reduce((n,p)=>n+p.value,0),c=a.reduce((n,p)=>n+p.capital,0);return {d:h.date,y:mode==='profit'?(c>0?(v-c)/c:null):v,active:a.length};}).filter(p=>p.active&&p.y!==null);
}
// Validate persisted data before it reaches the view or replaces a backup.
const record = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const text = (v, max=2000) => typeof v === 'string' && v.length <= max;
const number = (v, min=0, max=1e12) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
const id = v => Number.isSafeInteger(v) && v > 0;
const timestamp = v => text(v,40) && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v));
const optional = (v, check) => v == null || check(v);
const link = v => text(v,1000) && (!v || (()=>{try{return ['http:','https:'].includes(new URL(v).protocol)}catch{return false}})());
function requireData(ok, part) { if (!ok) throw Error('Uszkodzone dane: '+part+'.'); }
function quote(q) {
 return record(q) && number(q.close) && text(q.currency,10) && validDate(q.date)
   && optional(q.fx,v=>number(v,Number.MIN_VALUE)) && optional(q.fxDate,validDate)
   && optional(q.source,v=>text(v,100));
}
export function validateState(s) {
 requireData(record(s) && s.version===1 && Number.isSafeInteger(s.revision) && s.revision>=0,'format lub rewizja');
 for (const key of ['products','history','alerts','watch','reportIds']) requireData(Array.isArray(s[key]),key);
 for (const key of ['quotes','attempts','fx','rules']) requireData(record(s[key]),key);
 requireData(typeof s.hasKey==='boolean','hasKey');
 const ids=new Set();
 for (const p of s.products) {
  requireData(record(p),'produkt');
  const normalized=productFields(p);
  requireData(text(p.name,90) && text(p.account,60) && text(p.type,30) && text(p.sector,60) && text(p.symbol,100) && link(p.url) && id(p.id) && !ids.has(p.id) && number(p.capital,Number.MIN_VALUE) && number(p.value)
   && typeof p.auto==='boolean' && optional(p.quantity,v=>number(v))
   && validDate(p.added) && validDate(p.updated) && optional(p.purchaseDate,validDate)
   && optional(p.quote,quote),'produkt lub wycena');
  p.type=normalized.type; ids.add(p.id);
 }
 for (const h of s.history) {
  requireData(record(h) && validDate(h.date) && timestamp(h.at) && text(h.reason,100) && Array.isArray(h.assets),'historia');
  const seen=new Set();
  for (const a of h.assets) {
   requireData(record(a) && id(a.id) && !seen.has(a.id) && number(a.value)
    && number(a.capital,Number.MIN_VALUE) && validDate(a.updated),'pozycja historii');
   seen.add(a.id); // Deleted products may still have valid historical observations.
  }
 }
 const alertIds=new Set();
 for (const a of s.alerts) {
  requireData(record(a) && text(a.id,300) && a.id.length>0 && !alertIds.has(a.id)
   && ['report','calendar','dividend','price'].includes(a.type) && text(a.companyId,100)
   && text(a.title) && text(a.text,20000) && text(a.time,300) && text(a.sourceName,300)
   && link(a.url) && typeof a.read==='boolean','alert');
  alertIds.add(a.id);
  for (const key of ['eventDate','publicationDate']) requireData(optional(a[key],validDate),'data alertu');
  requireData(optional(a.discoveredAt,timestamp) && optional(a.dividendReminder,v=>typeof v==='boolean'),'metadane alertu');
  if(a.type==='dividend') {
   const d=a.dividend;
   requireData(record(d) && ['approved','proposed'].includes(d.status) && number(d.perShare)
    && text(d.currency,10),'dywidenda');
   for(const key of ['recordDate','paymentDate','exDate']) requireData(optional(d[key],validDate),'data dywidendy');
  }
 }
 const r=s.rules;
 requireData(typeof r.reports==='boolean' && typeof r.price==='boolean'
  && optional(r.dividends,v=>typeof v==='boolean') && number(r.threshold,.1,100)
  && ['daily','weekly'].includes(r.frequency),'zasady');
 for(const key of ['watch','reportIds']) requireData(s[key].every(v=>text(v,300)) && new Set(s[key]).size===s[key].length,key);
 for(const q of Object.values(s.quotes)) requireData(quote(q),'katalog wycen');
 for(const fx of Object.values(s.fx)) requireData(record(fx) && number(fx.rate,Number.MIN_VALUE) && validDate(fx.date),'kurs waluty');
 // These fields are retained for file compatibility; demo has no provider quota or report scanner.
 requireData(Object.keys(s.attempts).length===0 && s.quota==null && s.reportScan==null && s.reportError==null,'stan dostawcy');
 requireData(optional(s.synthetic,v=>typeof v==='boolean') && optional(s.anchor,validDate)
  && optional(s.dataMode,v=>v==='synthetic'),'tryb danych');
 if(s.lastCheck!=null) requireData(record(s.lastCheck) && timestamp(s.lastCheck.at)
  && Array.isArray(s.lastCheck.messages) && s.lastCheck.messages.every(v=>text(v,2000)),'ostatnie sprawdzenie');
 return s;
}
