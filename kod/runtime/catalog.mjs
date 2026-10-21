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
export function validateState(s){
 if(!s||s.version!==1||!Number.isInteger(s.revision)||!Array.isArray(s.products)||!Array.isArray(s.history)||!Array.isArray(s.alerts)||!Array.isArray(s.watch)||!s.rules||!s.quotes||!s.attempts||!s.fx||!Array.isArray(s.reportIds))throw Error('Nieprawidłowy format danych.');
 const ids=new Set();for(const p of s.products){const normalized=productFields(p);p.type=normalized.type;if(!Number.isInteger(p.id)||ids.has(p.id)||!validDate(p.added)||!validDate(p.updated))throw Error('Uszkodzone dane produktu.');ids.add(p.id);}
 for(const h of s.history){if(!validDate(h.date)||!Array.isArray(h.assets)||h.assets.some(p=>!Number.isFinite(p.value)||p.value<0||!Number.isFinite(p.capital)||p.capital<=0))throw Error('Uszkodzona historia.');}
 return s;
}
