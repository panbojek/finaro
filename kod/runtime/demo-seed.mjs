import fixture from '../../demo/portfolio.json' with {type:'json'};
import {day,validateState} from './catalog.mjs';
export function createDemoState(today=day()){
 const offset=(Date.parse(today)-Date.parse(fixture.anchor))/86400000;
 const shift=value=>{
  if(typeof value==='string')return value.replace(/\d{4}-\d{2}-\d{2}/g,d=>new Date(Date.parse(d)+offset*86400000).toISOString().slice(0,10));
  if(Array.isArray(value))return value.map(shift);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,shift(v)]));
  return value;
 };
 const s=shift(fixture);delete s.catalog;s.dataMode='synthetic';return validateState(s);
}
