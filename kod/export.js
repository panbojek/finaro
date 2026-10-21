'use strict';
// Eksportuje tylko jawnie wymienione pola portfela, bez alertów i ustawień aplikacji.
function portfolioSnapshot(){return liveSnapshot()}
const markdownValue=value=>String(value).replace(/[\r\n]+/g,' ').replace(/\|/g,'\\|');
function portfolioMarkdown(snapshot){
 const s=snapshot,lines=['# Finaro — zestawienie portfela do analizy','',
  'DEMO — dane syntetyczne, fikcyjne nazwy, kwoty, historia i ceny. Nie są to dane rynkowe ani portfel autora.','',
  `Dzień zestawienia: ${date(s.referenceDate)}. Wygenerowano: ${s.generatedAt}.`,
  'Zakres: wszystkie produkty, niezależnie od filtrów aplikacji. Waluta zestawienia: PLN.',
  'Wartości są ostatnimi znanymi wycenami; sprawdź datę przy każdej pozycji.','',
  '## Podsumowanie',`- Wartość: ${money(s.totalValuePLN)}`,`- Wpłacony kapitał: ${money(s.totalContributedCapitalPLN)}`,
  `- Zysk / strata: ${signedMoney(s.totalProfitLossPLN)}`,
  `- Prosty wynik względem kapitału: ${s.simpleReturnPercent===null?'brak danych':pct(s.simpleReturnPercent/100)} (nie w skali roku)`,'',
  '## Struktura według typów aktywów'];
 for(const a of s.allocationByType)lines.push(`- ${markdownValue(a.type)}: ${money(a.valuePLN)} · ${a.weightPercent===null?'—':pct(a.weightPercent/100)}`);
 lines.push('','## Wszystkie aktywa');
 s.assets.forEach((a,i)=>{
  lines.push('',`### ${i+1}. ${markdownValue(a.name)}`,
   `- Symbol: ${a.symbol||'nie podano'}; ISIN: ${a.isin||'nie podano'}`,
   `- Typ: ${markdownValue(a.type)}; branża / profil: ${markdownValue(a.profile)}`,
   `- Konto / miejsce: ${markdownValue(a.account)}`,
   `- Waluta notowania: ${a.quoteCurrency||'nie podano / nie dotyczy'}; kwoty poniżej: PLN`,
   `- Data pierwszego zakupu: ${a.firstPurchaseDate?date(a.firstPurchaseDate):'NIE PODANO'}`,
   `- Dodano do Finaro: ${date(a.addedToFinaro)} (nie jest to data zakupu)`,
   `- Data ostatniej wyceny: ${date(a.lastValuationDate)}`,
   `- Monit wyceny ręcznej: ${a.requiresManualValuationUpdate?'WYMAGA AKTUALIZACJI (14 dni lub brak daty)':'brak'}`,
   `- Wpłacony kapitał: ${money(a.contributedCapitalPLN)}`,
   `- Aktualna wartość: ${money(a.currentValuePLN)}`,
   `- Zysk / strata: ${signedMoney(a.profitLossPLN)}`,
   `- Prosty wynik: ${a.simpleReturnPercent===null?'nie można obliczyć':pct(a.simpleReturnPercent/100)}`,
   `- Udział w portfelu: ${a.portfolioWeightPercent===null?'—':pct(a.portfolioWeightPercent/100)}`,
   `- Liczba jednostek: ${a.quantity===null?'nie podano':a.quantity}`,
   `- Wycena: ${a.valuationMode}`,
   `- Informacje: ${a.informationUrl||'nie dodano linku'}`);
 });
 const missing=s.assets.filter(a=>!a.firstPurchaseDate).length;
 lines.push('','## Braki i ograniczenia',`- Brak daty pierwszego zakupu dla ${missing} z ${s.assets.length} pozycji.`,...s.limitations.map(x=>'- '+x),
  '', '## Kontekst potrzebny do analizy strategicznej',
  'Nie ustalono jeszcze: celu inwestowania, horyzontu, tolerancji ryzyka, wymaganej płynności, planowanych dopłat i ograniczeń podatkowych.',
  'Przed wnioskami o dopasowaniu portfela trzeba uzupełnić ten kontekst. Nie zakładaj brakujących danych ani składu funduszy.',
  'Ten sam instrument na różnych kontach stanowi łączną ekspozycję; nie traktuj go jako niezależnej dywersyfikacji.');
 return lines.join('\n');
}
function openPortfolioExport(){
 const snapshot=portfolioSnapshot();$('#exportText').value=portfolioMarkdown(snapshot);
 const missing=snapshot.assets.filter(a=>!a.firstPurchaseDate).length;
 $('#exportMissing').textContent=`${snapshot.assets.length} produktów. ${missing?'Brak daty zakupu dla '+missing+' pozycji — uzupełnisz ją w szczegółach produktu.':'Daty pierwszego zakupu uzupełnione.'}`;
 $('#exportStatus').textContent='Możesz skopiować całość jednym przyciskiem lub pobrać plik.';$('#exportDialog').showModal();
}
function downloadPortfolio(content,type,extension){
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download=`finaro-portfel-${TODAY}.${extension}`;document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);$('#exportStatus').textContent='Przygotowano plik zestawienia do pobrania.';
}
$('#exportPortfolio').addEventListener('click',openPortfolioExport);
$('#copyPortfolio').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText($('#exportText').value);$('#exportStatus').textContent='Skopiowano całe zestawienie. Możesz wkleić je do wybranego narzędzia.'}
 catch{$('#exportText').focus();$('#exportText').select();$('#exportStatus').textContent='Przeglądarka nie udostępniła kopiowania. Tekst zaznaczono — naciśnij Ctrl+C (na Macu ⌘C).'}
});
$('#downloadPortfolioText').addEventListener('click',()=>downloadPortfolio($('#exportText').value,'text/markdown;charset=utf-8','md'));
$('#downloadPortfolioJson').addEventListener('click',()=>downloadPortfolio(JSON.stringify(portfolioSnapshot(),null,2),'application/json;charset=utf-8','json'));
