# EODHD i darmowy plan dla małego portfela

[EODHD](https://eodhd.com/) to zewnętrzny dostawca danych giełdowych, m.in. cen akcji i ETF-ów. API pozwala aplikacji pobierać dane automatycznie zamiast przepisywać je ręcznie. EOD oznacza End of Day: dane po zakończeniu sesji giełdowej.

## Czy trzeba za to płacić?

EODHD ma **bezpłatny plan Free Package**. Według warunków sprawdzonych 21.10.2026 obejmuje **20 jednostek limitu API dziennie**, rok historii EOD i ograniczenie 20 żądań na minutę. Standardowy odczyt EOD zużywa jedną jednostkę; inne rodzaje danych mogą kosztować więcej. Szczegóły i aktualne warunki: [cennik EODHD](https://eodhd.com/pricing).

## Kiedy darmowy plan wystarczy?

Dla małego projektu do osobistego śledzenia portfela, aktualizowanego raz dziennie lub rzadziej, darmowy plan może w zupełności wystarczyć. Nie trzeba od razu kupować abonamentu. O wystarczalności decyduje liczba unikalnych instrumentów i sposób pobierania danych, a nie wartość portfela.

Przykład obliczenia budżetu: sześć różnych instrumentów, jeden standardowy odczyt EOD każdego dziennie, to sześć jednostek limitu. Pozostaje zapas na dodatkowe czynności. To przykład dla tak zaprojektowanej integracji, nie pomiar działania obecnego demo.

Ten sam ETF na dwóch rachunkach powinien korzystać z jednej pobranej ceny. Ponowne otwarcie ekranu powinno używać zapisu lokalnego, a nie pobierać wszystkiego ponownie. W budżecie trzeba uwzględnić wyszukiwanie instrumentów, katalogi, powtórzenia i inne wywołania. Częste aktualizacje lub rozbudowane dane mogą przekroczyć darmowy limit. Przed integracją sprawdź dostępność konkretnego instrumentu, giełdę i walutę.

Dokumentacja standardowych cen: [EOD Historical Data API](https://eodhd.com/financial-apis/api-for-historical-data-and-volumes). Dobór częstotliwości, wspólne odczyty i zapisywanie już pobranych cen są zadaniem osoby lub asystenta przygotowującego integrację.

## Jak to się odnosi do Finaro demo?

**Ta paczka działa bez EODHD.** Ceny, waluty, historia i alerty są syntetyczne, więc nie trzeba zakładać konta ani wpisywać klucza. Założenie konta lub posiadanie darmowego klucza samo nie włącza prawdziwych notowań w tej edycji.

EODHD jest opcją dalszego rozwoju własnej wersji programu. Aby z niej korzystać, Claude Code musi przygotować połączenie z dostawcą, zastąpić fikcyjne symbole właściwymi instrumentami i zabezpieczyć klucz poza repozytorium. [Gotowe polecenie i test własnego portfela](WLASNY-PORTFEL.md). Nie wklejaj klucza do rozmowy ani publicznych plików.

## Wycena własnego, rzeczywistego portfela

Po wdrożeniu integracji z EODHD aplikacja może aktualizować wycenę akcji i ETF-ów, które rzeczywiście posiadasz. Przykładowy przepływ wygląda tak:

1. Wprowadzasz własne produkty: instrument i giełdę, liczbę jednostek, wpłacony kapitał oraz rachunek. Rzeczywiste dane zapisujesz lokalnie poza repozytorium, w oddzielnym magazynie od demo.
2. Zakładasz konto na [eodhd.com](https://eodhd.com/) i uzyskujesz własny klucz. Dla niewielkiego zakresu zaczynasz od darmowego planu po sprawdzeniu jego aktualnych warunków.
3. W skonfigurowanej integracji klucz zapisujesz lokalnie, w chronionym ustawieniu, a nie w kodzie, publicznym pliku z przykładami lub rozmowie z AI.
4. Aplikacja pobiera dostępne ceny instrumentów. Wartość pozycji liczy z liczby jednostek i ceny; dla obcej waluty potrzebne jest również uzgodnione źródło kursu do PLN.
5. Produkty bez odpowiedniego źródła ceny aktualizujesz ręcznie. Historię i kopie zachowujesz lokalnie.

EODHD dostarcza dane rynkowe. **Nie loguje się do Twojego rachunku i nie wie, ile akcji posiadasz, ile za nie zapłaciłeś ani co dokupiłeś.** Te informacje wprowadzasz lub importujesz osobno. Cena po zakończeniu sesji nie oznacza wyceny na żywo i może różnić się od wartości prezentowanej przez brokera.

To opis działania po dostosowaniu Twojej lokalnej kopii, nie funkcja włączona w obecnej paczce. Przejdź według [przewodnika od demo do własnego portfela](WLASNY-PORTFEL.md), który zawiera jedno gotowe polecenie dla Claude Code. Nie potrzebujesz osobnego ekranu wyboru trybów.

Przed rzeczywistym użyciem ponownie sprawdź warunki swojego konta. Darmowy plan nie oznacza nieograniczonego pobierania ani automatycznej zgody na publiczne rozpowszechnianie danych dostawcy.

## Czego nie należy zakładać na podstawie planu Free

Cennik sprawdzony 21.10.2026 potwierdza 20 jednostek dziennie, 20 żądań na minutę i rok historii. Dane szczegółowe o spółkach i ETF-ach (Fundamentals) oraz kalendarz raportów (Corporate calendar) nie są objęte tym planem. Dane o dywidendach są wymienione oddzielnie, ale ich obecność nie oznacza gotowych alertów o wszystkich planowanych wypłatach. Dostępność konkretnego rodzaju zdarzenia wymaga weryfikacji. Warunki osobistego używania nie oznaczają zgody na publiczne rozpowszechnianie notowań. [Aktualny cennik i porównanie zakresów](https://eodhd.com/pricing).
