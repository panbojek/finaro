import {validateState} from './catalog.mjs';
export function inAlertScope(a){
 return a.type==='price'||a.type==='dividend'||(['report','calendar'].includes(a.type)&&/kwart|quarter|\bQ[1-4]\b/i.test(a.title||''));
}
export function prepareAlertScope(state){
 validateState(state);if(state.recoveryError)throw Error('Portfel wymaga odtworzenia.');
 const s=structuredClone(state),before=s.alerts.length;s.alerts=s.alerts.filter(inAlertScope);
 return {state:s,added:0,updated:0,removed:before-s.alerts.length,skipped:0};
}
