# Instalacja i uruchomienie krok po kroku

## Uruchomienie z Claude Code

Możesz powierzyć sprawdzenie wymagań i uruchomienie Claude Code. **[Przewodnik uruchomienia przez Claude Code](URUCHOMIENIE-Z-AI.md)** zawiera gotowe polecenie z linkiem do repozytorium. Zakładamy, że znasz już Claude Code. Poniżej jest samodzielna ścieżka instalacji, z której może korzystać również asystent.

## Wymagania

- Windows 10 lub 11 i zwykłe konto użytkownika; aplikacja nie wymaga uruchamiania jako administrator.
- Node.js 24 LTS z [oficjalnej strony](https://nodejs.org/en/download).
- Windows PowerShell i aktualna przeglądarka.

macOS i Linux nie są obsługiwane przez ten sposób szyfrowania i launcher. Kod interfejsu można przenieść, lecz trzeba zastąpić warstwę DPAPI i uruchamianie.

## Pierwsza instalacja

1. Pobierz instalator Node.js dla Windows i swojej architektury komputera. Zainstaluj z domyślnym dodaniem do PATH.
2. Pobierz i rozpakuj ZIP projektu do dowolnego folderu, np. Dokumenty/Finaro-demo. Nie otwieraj programu bezpośrednio z ZIP.
3. W rozpakowanym folderze znajdź README.md, dokumentację i katalog kod.
4. W katalogu kod kliknij dwukrotnie Uruchom-Finaro.cmd w Eksploratorze Windows. Otwarcie tego pliku w edytorze tylko pokaże jego treść.
5. Poczekaj na otwarcie przeglądarki pod http://127.0.0.1:47832. Pierwszy start tworzy osobny magazyn demo i zapisuje fikcyjny portfel.
6. Sprawdź obecność banera FINARO DEMO. Do startu nie potrzeba klucza EODHD (zewnętrzny dostawca notowań giełdowych) ani logowania.

Jeśli Windows lub polityka firmowa zablokuje pobrany plik, sprawdź źródło paczki i komunikat. Nie wyłączaj globalnie zabezpieczeń systemu. Na urządzeniu zarządzanym skontaktuj się z administratorem.

## Kolejne uruchomienia

Ponownie kliknij ten sam plik .cmd. Jeśli serwer już działa, otworzy się istniejąca aplikacja. Możesz zrobić skrót do tego pliku na pulpicie. Po przeniesieniu folderu popraw skrót.

Zamknięcie karty nie kasuje danych i nie zawsze kończy proces. Aby zakończyć go całkowicie, wybierz **Ustawienia → Zakończ Finaro** i potwierdź. Ponowne uruchomienie wczytuje zapisane zmiany.

## Aktualizacja kodu

1. Zakończ aplikację przez Ustawienia.
2. Zachowaj dotychczasowy folder kodu do czasu sprawdzenia nowej wersji.
3. Pobierz i rozpakuj nową wersję do nowego folderu.
4. Uruchom nowy plik .cmd. Korzysta z tego samego magazynu FinaroDemo na tym koncie Windows.
5. Sprawdź zapisane zmiany i podstawowe funkcje. Czytaj informacje o ewentualnych zmianach formatu danych.

Nie kopiuj plików danych do repozytorium. Nie uruchamiaj jednocześnie dwóch wersji demo korzystających z tego samego magazynu.

## Alternatywa dla osób technicznych

Z folderu repozytorium uruchom `npm start`, a potem otwórz http://127.0.0.1:47832. Do testów użyj `npm test`. Nie potrzeba `npm install`, klucza API ani narzędzi do kompilacji. Ustawienie `127.0.0.1` udostępnia aplikację tylko temu komputerowi.

## Po obejrzeniu demo

Instalacja uruchamia przykładowy portfel. Aby używać własnych danych, poproś Claude Code o dostosowanie lokalnej kopii według [przewodnika własnego portfela](WLASNY-PORTFEL.md). Ten etap obejmuje zmianę kodu i sprawdzenie rzeczywistych źródeł, a nie ponowną instalację Claude Code ani zakup innej edycji programu.
