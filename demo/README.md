# Zestaw danych syntetycznych

portfolio.json jest wygenerowany od zera przez scripts/generate-fixture.mjs. Nie powstał przez anonimizację, skalowanie ani zamianę nazw rzeczywistego portfela.

Zawiera 16 wymyślonych pozycji: siedem akcji, cztery pozycje ETF (w tym ten sam instrument na dwóch rachunkach), dwie pozycje obligacyjne, jeden portfel zarządzany i dwie rezerwy gotówkowe. Rachunki i emitenci są fikcyjni. Zbieżność nazwy z rzeczywistym podmiotem jest przypadkowa. Typ Portfel zarządzany jest kategorią ogólną. Przykładowa pozycja jest fikcyjna; aplikacja nie łączy się z usługami zarządzania inwestycjami.

Historia obejmuje 13 cotygodniowych punktów na przestrzeni 84 dni. Są przykłady dodatniego i ujemnego wyniku, ręcznych wycen starszych niż dwa tygodnie, walut PLN/USD/EUR i czterech kategorii alertów.

Stała data odniesienia pliku to 2026-10-20. Podczas pierwszego uruchomienia/resetu loader przesuwa daty o wspólną liczbę dni względem bieżącego dnia w Polsce. Pozostają zachowane odstępy i kolejność, a zakup nie staje się datą dodania.

Zmiana generatora: `npm run fixture`. Zmiana działającego przykładu: Ustawienia → Przywróć dane demonstracyjne, po potwierdzeniu. Zapisane zmiany demo nie są automatycznie zastępowane samą aktualizacją kodu.

W tym pliku wolno przechowywać wyłącznie syntetyczne przykłady. Własne dane nigdy nie powinny zastępować publicznego fixture.
