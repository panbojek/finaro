import {catalog,day,round,productFields,snapshot,validDate} from './catalog.mjs';
import {addDividendReminders} from './dividends.mjs';
import {inAlertScope} from './alert-scope.mjs';
export class Service{
 constructor(store,state,fetcher=fetch){this.store=store;this.state=state;this.fetcher=fetcher;}
 async commit(s){s.revision=this.state.revision+1;await this.store.save(s);this.state=s;return this.view();}
 view(){return {...this.state,alerts:this.state.alerts.filter(inAlertScope),catalog};}
 async syncKey(){this.state.hasKey=false;}
 async change(action,b){
  if(this.state.recoveryError)throw Error('Nie można zapisywać do czasu przywrócenia poprawnej kopii.');
  const s=structuredClone(this.state);if(b.revision!==s.revision)throw Error('Dane zmieniły się w innym oknie. Odśwież stronę przed zapisem.');
  if(action==='product'){
   const fields=productFields(b.product),old=s.products.find(p=>p.id===b.id);
   if(b.id!=null&&!old)throw Error('Nie znaleziono produktu.');
   if(old){const was=structuredClone(old);Object.assign(old,fields);if(was.value!==old.value||was.symbol!==old.symbol||was.quantity!==old.quantity||was.auto!==old.auto){old.updated=day();old.quote=null;} }
   else{s.products.push({...fields,id:Math.max(0,...s.products.map(p=>p.id),...s.history.flatMap(h=>h.assets.map(a=>a.id)))+1,added:day(),updated:day(),quote:null});}
   if(fields.auto&&fields.type==='Akcje'&&!s.watch.includes(fields.symbol))s.watch.push(fields.symbol);
   snapshot(s,'product');
  }else if(action==='valuation'){
   const p=s.products.find(p=>p.id===b.id);if(!p)throw Error('Nie znaleziono produktu.');const value=Number(b.value);
   if(!Number.isFinite(value)||value<0||value>1e12)throw Error('Sprawdź wartość w PLN.');p.value=round(value);p.updated=day();p.quote=null;snapshot(s,'manual');
  }else if(action==='delete'){
   if(b.confirm!==true)throw Error('Usunięcie wymaga potwierdzenia.');if(!s.products.some(p=>p.id===b.id))throw Error('Nie znaleziono produktu.');s.products=s.products.filter(p=>p.id!==b.id);snapshot(s,'delete');
  }else if(action==='rules'){
   const threshold=Number(b.rules.threshold);if(!Number.isFinite(threshold)||threshold<.1||threshold>100)throw Error('Próg musi wynosić od 0,1 do 100%.');
   s.rules={reports:!!b.rules.reports,price:!!b.rules.price,dividends:b.rules.dividends!==false,threshold,frequency:b.rules.frequency==='weekly'?'weekly':'daily'};
  }else if(action==='watch'){
   if(!catalog.some(c=>c.symbol===b.symbol&&c.type==='Akcje'))throw Error('Wybierz spółkę z katalogu.');s.watch=b.watch?[...new Set([...s.watch,b.symbol])]:s.watch.filter(x=>x!==b.symbol);
  }else if(action==='read'){for(const a of s.alerts)if(b.id==='all'||a.id===b.id)a.read=true;}
  else throw Error('Nieznana czynność.');return this.commit(s);
 }
}
