# Rozwój i dopasowanie do swoich potrzeb

Kod jest dostępny do modyfikacji na licencji MIT. To mały projekt bez frameworka i bez zależności npm, przeznaczony także do eksperymentów z pomocą AI. Znaki marki mają osobne zasady w ASSETS.md.

Jeżeli chcesz dopiero uruchomić program z pomocą asystenta, zacznij od [Uruchomienia z AI](URUCHOMIENIE-Z-AI.md). Rozwój i zmiany kodu są kolejnym krokiem, oddzielnym od instalacji.

## Chcę używać własnego portfela

Zacznij od [przewodnika użytkownika i gotowego polecenia dla Claude Code](WLASNY-PORTFEL.md). Dostosowujesz swoją kopię po obejrzeniu demo; nie dodajesz osobnego wyboru trybów do publicznej aplikacji. Poniższa mapa i szczegóły techniczne pomagają asystentowi wykonać tę pracę.

## Mapa plików

| Plik | Rola |
|---|---|
| kod/index.html | Ekran, formularze, style, stopka i baner demo |
| kod/dashboard.js | Obliczenia prezentacji, filtry, wykresy i tabela |
| kod/live.js | Formularze, lokalne API, ustawienia, szczegóły i stan klienta |
| kod/export.js | Tekstowy eksport i pobieranie JSON |
| kod/runtime/server.mjs | HTTP, ochrona żądań, kolejka zapisów i dozwolone pliki |
| kod/runtime/service.mjs | Wspólne operacje produktów i alertów |
| kod/runtime/demo-service.mjs | Symulowane ceny i reset demo; bez pobierania danych rynkowych |
| kod/runtime/catalog.mjs | Walidacja, katalog z fixture, daty i historia |
| kod/runtime/demo-seed.mjs | Wczytanie fikcyjnego portfela i przesunięcie dat |
| kod/runtime/store.mjs, dpapi.ps1 | Zapis atomowy, kopie i szyfrowanie Windows |
| kod/runtime/launch.ps1 | Uruchamianie z Windows i otwieranie przeglądarki |
| demo/portfolio.json | Wyłącznie jawne, wymyślone dane początkowe |
| scripts/generate-fixture.mjs | Powtarzalny generator fixture |
| tests/ | Testy obliczeń, zapisu, API i klienta |

## Rozwój z Claude Code

1. Zrób kopię projektu lub nową gałąź Git. Uruchom demo i zobacz jego działanie.
2. Otwórz repozytorium lokalnie w Claude Code. Poproś o przeczytanie CLAUDE.md, AGENTS.md i README.md. Instrukcje projektu mają pozostać razem z kodem.
3. Opisz potrzebę jednym konkretnym przykładem. Nie musisz wybierać technologii.
4. Poproś o test istotnego zachowania, aktualizację dokumentacji i podsumowanie ograniczeń. Przejrzyj różnice przed przyjęciem zmian.

Opis i instalacja samego narzędzia: [oficjalna dokumentacja Claude Code](https://code.claude.com/docs/en/overview). Nie przekazuj rzeczywistego portfela ani kluczy.

Alternatywnie możesz rozwijać projekt z ChatGPT/Codex lub innym asystentem mającym dostęp do kodu. Plik AGENTS.md zawiera instrukcje dla tego rodzaju narzędzi.

## Przykładowe polecenia do AI

> Przeczytaj AGENTS.md, CLAUDE.md i README.md. Chcę uprościć formularz dodawania produktu. Zachowaj oddzielny magazyn demo i wyraźne oznaczenie danych syntetycznych. Zaproponuj zmianę na podstawie obecnego kodu, a następnie sprawdź dodawanie i edycję.

> Dodaj filtr po rachunku w mojej kopii demo. Nie zmieniaj sposobu liczenia całego portfela w czasie. Przetestuj zachowanie przy dwóch pozycjach tego samego instrumentu na różnych rachunkach.

> Przygotuj integrację z wybranym dostawcą notowań. Najpierw sprawdź oficjalną dokumentację, dokładne instrumenty, waluty, daty cen, koszt i limit. Zachowaj działające demo offline. Nie wpisuj klucza do kodu ani czatu i nie uruchamiaj płatnych usług.

## Modyfikacja przykładowych danych

Edytuj generator, uruchom `npm run fixture`, a potem użyj resetu w Ustawieniach. Sama zmiana JSON nie nadpisuje zapisanych lokalnych zmian. Po regeneracji uruchom `npm test`.

## Prawdziwe źródła i inne systemy

Punktem wyjścia może być EODHD, zewnętrzny dostawca notowań z darmowym planem do niewielkich zastosowań. [Opis planu Free, limitów i przykładu obliczenia budżetu](EODHD.md). Przedstawiona wystarczalność dotyczy małego portfela i ograniczonej częstotliwości, nie każdego projektu.

Ta edycja świadomie ma wyłącznie fikcyjny katalog. Przed wprowadzaniem własnego portfela należy wyłączyć przykłady i symulację według przewodnika. Samo wpisanie rzeczywistego symbolu nie tworzy integracji.

Integracja rynkowa wymaga osobnego adaptera zamiast DemoService: weryfikacji symboli, walut, terminów sesji, limitów, cache, korekt cen, błędów i źródeł raportów. Sekrety pozostają poza repozytorium. Zapisz, co jest wyceną brokera, a co przeliczeniem według zewnętrznego kursu. Raporty kwartalne i dywidendy potrzebują własnych źródeł oraz deduplikacji. Nie usuwaj oznaczenia symulacji, dopóki faktyczne źródła nie zostaną wdrożone i sprawdzone.

Port na macOS/Linux wymaga wymiany DPAPI i launchera. Wersja online wymaga logowania, kontroli dostępu i nowego magazynu. GitHub przechowuje kod; GitHub Pages samo nie uruchomi tego serwera Windows.

## Kontrola zmian

`npm test` sprawdza fikcyjne dane i lokalne API. Test klienta używa uproszczonego DOM, nie przeglądarki. Po zmianach wyglądu osobno obejrzyj szeroki i wąski ekran oraz sprawdź klawiaturę. Nie zastępuj kontroli wizualnej liczbą zaliczonych testów.

## Techniczne granice ochrony

Zapis i kopie wykorzystują Windows DPAPI przypisane do aktualnego konta. Nie korzystają z localStorage. Serwer nasłuchuje na 127.0.0.1, sprawdza Host, Origin przy zmianach oraz losowy token sesji. Udostępnia wyłącznie dozwolone pliki. Token API nie jest logowaniem internetowym. Nie zmieniaj adresu na 0.0.0.0 bez projektu ochrony dostępu i danych.

Przed dostosowaniem zachowaj osobny folder dotychczasowego kodu i instrukcję uruchomienia. Commit/gałąź Git mogą być dodatkowym punktem powrotu; nie zabezpieczają danych zapisanych poza repozytorium. Przy zmianie formatu danych lub źródeł cen przygotuj odwracalną migrację i osobne testy. Zaliczenie testów demo nie weryfikuje rzeczywistej integracji.
