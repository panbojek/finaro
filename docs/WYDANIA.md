# Numeracja i przygotowanie wydań

Bieżąca wersja: **1.0.13**. Numer znajduje się w package.json.

Używamy formatu **główna.funkcje.poprawki**:

- ostatnia liczba rośnie przy poprawkach błędów i niezawodności, np. 1.0.12 → 1.0.13;
- środkowa rośnie przy nowych funkcjach zgodnych z dotychczasowym działaniem, np. 1.1.0;
- pierwsza rośnie przy istotnej zmianie niezgodnej z dotychczasowym sposobem używania lub zapisu danych, np. 2.0.0.

Wersja programu jest osobna od wewnętrznego numeru formatu danych. Wydanie 1.0.13 zachowuje dotychczasowy format danych demo i nie resetuje portfela. Dokładniejsza walidacja może odrzucić wcześniej akceptowany uszkodzony plik.

## Źródło wydania

Źródłem jest [repozytorium panbojek/finaro](https://github.com/panbojek/finaro). Kod, paczka i testy wydania muszą odnosić się do tego samego commita. Zmiany po pierwszej publikacji tworzą kolejne zwykłe commity; nie odtwarzamy roboczego dziennika ani nie przepisujemy opublikowanej historii.

## Procedura dla osoby przygotowującej wydanie

1. Zaktualizuj numer w package.json i dokumentację, zachowując zgodność zapisanych danych.
2. Uruchom npm test na Node.js 24 LTS co najmniej 24.22.1, wyłącznie na fikcyjnych danych. Po zmianach interfejsu osobno sprawdź przeglądarkę.
3. Zapisz gotowe pliki w commicie. Sprawdź czysty stan repozytorium i zakres publikowanych plików.
4. Utwórz tag v z numerem, np. v1.0.13, wskazujący ten commit.
5. Uruchom powershell.exe -NoProfile -File scripts/release.ps1. Skrypt odrzuca niezapisane zmiany i tag wskazujący inny commit.
6. W dist powstaną ZIP z zawartością taga, SHA256SUMS.txt oraz RELEASE.json z numerem, tagiem i pełnym identyfikatorem commita. Nie edytuj ZIP ręcznie.
7. Po zleceniu publikacji wyślij commit i tag do GitHuba. Paczkę można dołączyć do wydania GitHub Releases. Zmiana widoczności repozytorium wymaga osobnej decyzji.

Node 24.22.1 jest minimalnym wydaniem ze zweryfikowaną poprawką bezpieczeństwa. Środowisko uruchomienia nie jest dołączane do repozytorium. Pobieraj aktualne poprawki gałęzi 24 LTS z [oficjalnej strony Node.js](https://nodejs.org/en/download).
