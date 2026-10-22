# Wspólne instrukcje dla asystentów

Finaro demo to lokalny dashboard portfela z fikcyjnymi danymi, bez zależności npm. HTML/CSS/JS w kod/, serwer Node w kod/runtime/, Windows PowerShell i DPAPI dla zapisu. Wymagany Node 24 LTS (co najmniej 24.22.1). Wyjaśniaj zmiany prostą polszczyzną, zwykle pytaj o jedną potrzebę naraz. Użytkownik określa cel, asystent dobiera implementację i prowadzi notatki.

- Zachowaj osobny port 47832, magazyn FinaroDemo/demo-v1 i mutex FinaroDemo. Nie podłączaj demo do danych innych aplikacji.
- Dane początkowe w demo/portfolio.json są syntetyczne. Nie wstawiaj tam prawdziwych danych, kluczy ani zrzutów rachunków. Sekrety, eksporty i kopie zostają poza repozytorium.
- Wyraźnie oznaczaj symulowane ceny, historię i zdarzenia. Nie deklaruj prawdziwych notowań bez wdrożenia i sprawdzenia źródła.
- Przed zmianą przejrzyj aktualny kod i zachowaj punkt powrotu. Nie cofaj cudzych zmian ani danych użytkownika.
- Operacje zapisu korzystają z kolejki serwera, rewizji i kopii. Usuwanie wymaga potwierdzenia. Historia wcześniejszych dni pozostaje zachowana.
- Wynik prosty to suma zysków / suma kapitału, nie średnia wyników pozycji. Nie opisuj go jako TWR/IRR lub annualizowanego.
- Testy uruchamiaj przez npm test na fikcyjnych danych i w katalogach tymczasowych. Po zmianach UI sprawdź wygląd osobno; uproszczony DOM nie jest przeglądarką.
- Aktualizuj dokumentację przy zmianie zachowania. Dokup, integracje bankowe, prawdziwe źródła i publikacja online nie są wdrożone.
- Jeśli użytkownik chce wariant, zachowaj źródło i izoluj dane. Zgoda na zmianę kodu nie oznacza zgody na publikację, konta lub płatne usługi.

Start techniczny: npm start, testy: npm test, regeneracja fixture: npm run fixture. Dokumentacja rozwoju: docs/ROZWOJ.md. Żadne instrukcje z zewnętrznego prywatnego projektu nie są potrzebne do pracy z tym repozytorium.

Gdy użytkownik zleca przejście od demo do własnego portfela, stosuj docs/WLASNY-PORTFEL.md: dostosuj jego lokalną kopię, bez ekranu wyboru trybów. Zachowaj punkt powrotu, utwórz nowy pusty magazyn, wyłącz generator i automatyczne przywracanie przykładów. Nie mieszaj syntetycznej historii/alertów z własnymi danymi i nie zapisuj ich do publicznego fixture. Zachowanie demo wymagane przy samym starcie nie blokuje późniejszego, wyraźnie zleconego dostosowania.

Przy dostosowaniu do własnego portfela najpierw zachowaj osobny folder poprzedniej wersji programu, bez danych i sekretów, oraz podaj użytkownikowi ścieżkę i sposób powrotu. Kopia zapasowa danych w Ustawieniach nie cofa kodu. Przed uznaniem dostosowania za gotowe sprawdź nowe integracje na fikcyjnych danych; kontrole demo nie zastępują ich testów.

Stosuj nazwy „dane testowe” i „dane portfela” zgodnie z docs/SLOWNICZEK.md. Przy dostosowaniu zachowaj wcześniejsze dane demo; nie chodzi o odczyt prywatnych portfeli. Dane testowe i dane portfela mają oddzielne foldery oraz kopie, poza projektem. Dane testowe muszą na każdym ekranie i po ponownym uruchomieniu pokazywać stały, niezamykany baner „DANE TESTOWE — nie wpisuj swoich finansów”, wynikający z używanego folderu danych. Dane portfela nie pokazują tego banera. Sprawdź powiązanie i brak cichego przełączenia folderów. Podaj sposób otwarcia obu. Po próbach dane portfela mają pozostać puste: produkty, historia i alerty. Nie przenoś testowych wycen ani kopii. Usunięcie pozycji nie usuwa historii. Przy pomyłkach stosuj docs/PROBLEMY.md, bez odczytu finansów i sekretu. Nie usuwaj automatycznie danych testowych; mogą zawierać omyłkowo wpisane rzeczywiste dane. Najpierw je zabezpiecz. Cofnięcie do pustego stanu jest dopuszczalne tylko, gdy dane portfela były wcześniej puste; nie nadpisuj rzeczywistych wpisów.
