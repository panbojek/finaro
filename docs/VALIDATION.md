# Zakres sprawdzenia aplikacji

Stan na 21.10.2026. Środowisko: Windows, Node.js 24.16, Windows PowerShell. Do sprawdzeń używano wyłącznie fikcyjnych danych i oddzielnych folderów testowych.

## Sprawdzone działanie

Ostatni przebieg obejmował **71 zakończonych powodzeniem kontroli**:

- 31 kontroli rdzenia: obliczenia portfela, walidacja, zgodność starszej nazwy kategorii, symulacja cen, historia, edycja, potwierdzanie usuwania, zapis, kopie zapasowe, szyfrowanie Windows i zachowanie przy uszkodzonych danych.
- 40 kontroli klienta: formularze, szczegóły produktów, ręczna wycena, filtry, wykresy, eksport, alerty, przypomnienia dywidendowe i zakończenie programu. Test korzysta z uproszczonego modelu strony i rzeczywistego lokalnego serwera; nie zastępuje kontroli w przeglądarce.

W Edge sprawdzono podstawowe ekrany, brak nieczynnych pól zasad alertów oraz zapis przełącznika fikcyjnych dywidend. Obejrzano zrzuty dokumentacji; przygotowano również kontrolny widok przy szerokości 390 px. Dane innych aplikacji oraz klucze nie były odczytywane.

Po ostatnim przebiegu testów zmieniano wyłącznie dokumentację i numer paczki. Kodu oraz danych demonstracyjnych nie zmieniano. Ponowienie kontroli: `npm test`.

## Granice sprawdzenia

- Nie wykonano pełnego testu dostępności, wszystkich interakcji ani zgodności z każdą przeglądarką i konfiguracją Windows.
- Nie przeprowadzono próby całej instrukcji z nową osobą nietechniczną ani dostosowania do własnego portfela przez Claude Code od początku do końca.
- Prawdziwe notowania, połączenia z bankami i publikacja internetowa nie są funkcjami demo i nie były testowane.
- Baner danych testowych i rozdzielenie ich od danych portfela są wymaganiami przyszłego dostosowania, a nie dodatkowym wyborem dostępnym w obecnej paczce.

Testy demo nie potwierdzają poprawności przyszłych integracji lub modyfikacji. Po dostosowaniu programu konieczne są osobne sprawdzenia nowych funkcji.
