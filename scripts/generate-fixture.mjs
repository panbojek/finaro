// Deterministic invented portfolio. No source portfolio is read or transformed.
import fs from 'node:fs/promises';
const anchor='2026-10-20',dateOffset=n=>new Date(Date.parse(anchor)+n*86400000).toISOString().slice(0,10),round=n=>Math.round(n*100)/100;
const names=[['AURORA','Aurora Energy','Energetyka',132],['NORTH','Northstar Software','Technologia',48],['BALTIC','Baltic Logistics','Logistyka',205],['HELIOS','Helios Health','Zdrowie',76],['COBALT','Cobalt Industry','Przemysł',61],['SUMMIT','Summit Retail','Handel',110],['RIVER','River Networks','Technologia',38]];
const catalog=names.map(([code,name,sector,baseClose])=>({symbol:'DEMO-'+code,name,currency:'PLN',type:'Akcje',sector,url:'',baseClose}));
catalog.push(...[['WORLD','Atlas World ETF','USD',95],['BALANCE','Horizon Balanced ETF','EUR',67],['BONDS','Terra Bond ETF','EUR',41]].map(([code,name,currency,baseClose])=>({symbol:'DEMO-'+code,name,currency,type:'ETF-y',sector:'Wielobranżowe',url:'',baseClose})));
const products=[];
function add(instrument,quantity,account,growth=.08){const fx=instrument.currency==='USD'?4:instrument.currency==='EUR'?4.3:1,value=round(instrument.baseClose*quantity*fx),id=products.length+1;products.push({...instrument,id,quantity,account,value,capital:round(value/(1+growth)),auto:true,added:dateOffset(-84),updated:anchor,purchaseDate:dateOffset(-190-id*9),quote:{close:instrument.baseClose,currency:instrument.currency,date:anchor,fx,fxDate:anchor,source:'synthetic'}});delete products.at(-1).baseClose;}
names.forEach((_,i)=>add(catalog[i],[25,80,12,40,65,18,100][i],'Broker Alfa · rachunek',[.12,-.06,.09,.04,.17,-.03,.07][i]));
add(catalog[7],34,'Broker Alfa · rachunek',.11);add(catalog[8],51,'Broker Beta · IKE',.06);add(catalog[7],28,'Broker Beta · IKE',.13);add(catalog[9],42,'Broker Alfa · rachunek',.025);
function manual(name,type,value,capital,account,age,quantity=null){products.push({id:products.length+1,name,type,sector:type==='Obligacje'?'Obligacje skarbowe':type==='Gotówka'?'Gotówka':'Wielobranżowe',symbol:'',url:'',quantity,account,value,capital,auto:false,added:dateOffset(-84),updated:dateOffset(-age),purchaseDate:dateOffset(-240),quote:null});}
manual('Obligacje demonstracyjne · seria A','Obligacje',18450,18000,'Agent Gamma · obligacje',5,180);
manual('Obligacje demonstracyjne · seria B','Obligacje',7350,7000,'Agent Gamma · obligacje',18,70);
manual('Portfel zarządzany · przykład','Portfel zarządzany',26300,24000,'Platforma Delta',4);
manual('Rezerwa oszczędnościowa','Gotówka',31700,31000,'Bank Epsilon',21);
manual('Środki na przyszłe zakupy','Gotówka',6400,6400,'Broker Alfa',3);
const history=[];for(let offset=-84;offset<=0;offset+=7){history.push({at:dateOffset(offset)+'T16:00:00.000Z',date:dateOffset(offset),reason:'synthetic',assets:products.map((p,i)=>({id:p.id,capital:p.capital,value:round(p.value*(1+offset/1400+Math.sin((offset+84)/11+i)*.012*(offset===0?0:1))),updated:dateOffset(offset)}))});}
const alerts=[
 {id:'demo-quarter',companyId:'DEMO-NORTH',type:'report',title:'SYMULACJA · Northstar: raport kwartalny',text:'Fikcyjna publikacja do prezentacji interfejsu. Nie jest komunikatem rynkowym.',time:'Demo · '+dateOffset(-1),url:'',sourceName:'Generator demonstracyjny',read:false},
 {id:'demo-calendar',companyId:'DEMO-BALTIC',type:'calendar',title:'SYMULACJA · Baltic: termin raportu kwartalnego',text:'Fikcyjny termin; nie dotyczy rzeczywistego emitenta.',time:'Termin demo: '+dateOffset(12),eventDate:dateOffset(12),url:'',sourceName:'Generator demonstracyjny',read:false},
 {id:'demo-dividend',companyId:'DEMO-AURORA',type:'dividend',title:'SYMULACJA · Aurora: zatwierdzona dywidenda',text:'Fikcyjna decyzja. Służy pokazaniu stawki i terminów, bez naliczania rzeczywistego przychodu.',time:'Demo · '+dateOffset(-3),url:'',sourceName:'Generator demonstracyjny',publicationDate:dateOffset(-3),read:false,dividend:{status:'approved',perShare:1.8,currency:'PLN',recordDate:dateOffset(1),paymentDate:dateOffset(8),exDate:null}},
 {id:'demo-price',companyId:'DEMO-COBALT',type:'price',title:'SYMULACJA · Cobalt: +6,2%',text:'Przykładowy ruch ceny pomiędzy dwiema fikcyjnymi sesjami.',time:'Demo · '+anchor,url:'',sourceName:'Generator demonstracyjny',read:true}
];
const data={synthetic:true,anchor,version:1,revision:0,catalog,products,history,alerts,watch:catalog.filter(c=>c.type==='Akcje').map(c=>c.symbol),rules:{reports:true,price:true,dividends:true,threshold:5,frequency:'daily'},quotes:{},attempts:{},fx:{},reportIds:[],reportScan:null,reportError:null,quota:null,hasKey:false};
await fs.writeFile(new URL('../demo/portfolio.json',import.meta.url),JSON.stringify(data,null,2)+'\n');console.log('Generated invented demo portfolio');
