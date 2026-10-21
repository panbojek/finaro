import {Service} from './service.mjs';
import {catalog,day,round,snapshot,productFields} from './catalog.mjs';
import {createDemoState} from './demo-seed.mjs';
import {addDividendReminders} from './dividends.mjs';
export class DemoService extends Service{
 async syncKey(){this.state.hasKey=false;}
 view(){return {...super.view(),dataMode:'synthetic'};}
 async change(action,b){
  if(action==='reset-demo'){
   if(this.state.recoveryError)throw Error('Nie można resetować przed odtworzeniem poprawnej kopii.');
   if(b.revision!==this.state.revision||b.confirm!==true)throw Error('Potwierdź reset i odśwież dane.');
   return this.commit(createDemoState());
  }
  return super.change(action,b);
 }
 async refresh(){
  if(this.state.recoveryError)throw Error('Nie można zapisywać przed odtworzeniem kopii.');
  const s=structuredClone(this.state),today=day();let changed=false;
  for(const p of s.products.filter(p=>p.auto)){
   const c=catalog.find(c=>c.symbol===p.symbol);if(!c)continue;
   const fx=c.currency==='USD'?4:c.currency==='EUR'?4.3:1;
   const phase=Date.parse(today)/86400000;
   const close=round(c.baseClose*(1+Math.sin(phase/8+catalog.indexOf(c))*.015)),value=round(p.quantity*close*fx);
   productFields({...p,value});
   if(p.value!==value||p.updated!==today||!p.quote){p.value=value;p.updated=today;p.quote={close,currency:c.currency,date:today,fx,fxDate:today,source:'synthetic'};changed=true;}
  }
  if(changed||(s.products.length&&s.history.at(-1)?.date!==today))snapshot(s,'synthetic');
  addDividendReminders(s,today);
  s.hasKey=false;s.lastCheck={at:new Date().toISOString(),messages:['SYMULACJA: ceny i kursy walut wygenerowano lokalnie. Nie pobrano notowań ani informacji z rynku.']};
  await this.commit(s);return this.view();
 }
}
