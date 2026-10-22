# Zakres sprawdzenia aplikacji

Wydanie **1.0.13**, stan na 22.10.2026. Środowisko: Windows, Node.js 24.22.1, Windows PowerShell. Wszystkie próby używają fikcyjnych danych i oddzielnych folderów testowych.

## Sprawdzone działanie

**119 kontroli zakończonych powodzeniem:**

- 31 kontroli rdzenia: fikcyjny portfel, obliczenia, zgodność starszej nazwy kategorii, symulacja, historia, operacje produktów, kopie, szyfrowanie Windows i wykrycie uszkodzonego pliku.
- 40 kontroli klienta: formularze, szczegóły, ręczna wycena, filtry, wykresy, eksport, alerty, przypomnienia i zamykanie. Uproszczony model strony i rzeczywisty lokalny serwer.
- 48 kontroli odporności: odrzucanie niepoprawnych danych, granice wersji Node, błędny adres HTTP bez tokenu, obsługa wyjątku widoku, brak zbędnych zapisów, zapis nowych przypomnień i obserwacji kolejnego dnia, pełne przywrócenie przez API oraz odczyt po ponownym uruchomieniu. Wstrzyknięte błędy szyfrowania, częściowego zapisu, tworzenia kopii i podmiany pliku nie zmieniają poprzednich danych. Sprawdzono usuwanie własnych plików tymczasowych i odzyskanie działania kolejki po błędach.

Powtórzenie: npm test na wspieranej wersji Node 24 LTS. Testy nie otwierają danych innych aplikacji ani kluczy.

Interfejs nie został zmieniony w tym wydaniu. Jego wcześniejsze podstawowe sprawdzenie w Edge obejmowało ekran główny, Ustawienia, szczegóły produktu i Zasady alertów oraz widok 390 px. Nie jest to pełny audyt przeglądarkowy.

## Granice sprawdzenia

- Nie wykonano pełnego testu dostępności, każdej interakcji ani zgodności ze wszystkimi przeglądarkami i konfiguracjami Windows.
- Próby błędów zapisu są kontrolowanymi symulacjami. Nie odtwarzają fizycznej awarii dysku lub odcięcia zasilania.
- Nie przeprowadzono instalacji na drugim komputerze ani całej instrukcji z nową osobą nietechniczną.
- Prawdziwe notowania, banki i usługa online nie są funkcjami demo. Przyszłe dostosowanie przez Claude Code wymaga osobnych testów.
- Baner danych testowych i rozdzielenie ich od danych portfela są wymaganiami przyszłego dostosowania, nie nowym wyborem dostępnym w obecnej paczce.

Numer, tag, commit i suma kontrolna paczki są wiązane przez [procedurę wydań](WYDANIA.md). Testy demo nie gwarantują bezpieczeństwa i poprawności każdej przyszłej modyfikacji.
