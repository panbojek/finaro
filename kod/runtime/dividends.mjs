import {day,catalog,validDate} from './catalog.mjs';
// Reminders use verified issuer dates only. They never credit income to the portfolio.
export function addDividendReminders(state,today=day()){
 if(state.rules.dividends===false)return 0;let count=0;const originals=state.alerts.filter(a=>a.type==='dividend'&&!a.dividendReminder&&a.dividend?.status==='approved');
 for(const a of originals){
  if(!state.products.some(p=>p.symbol===a.companyId))continue;
  for(const [field,label] of [['recordDate','ustalenia uprawnionych'],['paymentDate','planowanej wypłaty']]){
   const when=a.dividend[field];if(!when||!validDate(when))continue;const days=(Date.parse(when)-Date.parse(today))/86400000;if(days<0||days>1)continue;
   const id=`dividend-reminder:${a.id}:${field}:${when}`;if(state.alerts.some(x=>x.id===id))continue;
   state.alerts.unshift({id,companyId:a.companyId,type:'dividend',dividendReminder:true,dividend:a.dividend,sourceName:a.sourceName,url:a.url,publicationDate:a.publicationDate,eventDate:when,discoveredAt:new Date().toISOString(),read:false,time:`Termin: ${when} · przypomnienie ${today}`,title:`${catalog.find(c=>c.symbol===a.companyId)?.name||a.companyId}: termin ${label}`,text:`Według zatwierdzonego komunikatu emitenta termin ${label} przypada ${when}. Szczegóły decyzji i źródło są poniżej. To przypomnienie o terminie; przychód nie jest dopisywany do wartości portfela.`});count++;
  }
 }return count;
}
