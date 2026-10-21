# Uruchom Finaro demo z pomocą Claude Code

Zakładamy, że masz Claude Code i korzystasz z niego na swoim komputerze. Finaro demo wymaga lokalnego Windows 10/11; dane są szyfrowane mechanizmem konta Windows. Nie potrzeba konta maklerskiego ani klucza API.

## Gdzie rozpocząć pracę

Utwórz pusty folder na projekt, np. **Dokumenty → Moje aplikacje**. Otwórz ten folder jako lokalny projekt w używanym przez Ciebie Claude Code. Nie wybieraj folderu z inną aplikacją ani prywatnymi dokumentami.

Jeśli używasz terminala: otwórz ten folder w Eksploratorze, wybierz **Otwórz w terminalu** (w Windows 10 może to być okno PowerShell), wpisz `claude` i naciśnij Enter. To zakłada już zainstalowane i skonfigurowane Claude Code.

## Wklej polecenie

Repozytorium to folder z programem i instrukcjami udostępniony na GitHubie. [Pozostałe pojęcia](SLOWNICZEK.md).

Polecenie poniżej zawiera już adres [repozytorium Finaro](https://github.com/panbojek/finaro). Skopiuj je w całości. Claude Code pobierze projekt, sprawdzi wymagania i pomoże uruchomić aplikację. Nie musisz ręcznie pobierać ZIP-a ani obsługiwać Git.

Dostęp do prywatnego repozytorium wymaga uprawnień i zalogowania na GitHubie. Hasła ani tokena nie wklejaj do rozmowy. Jeśli nie masz dostępu, poproś właściciela repozytorium o jego nadanie.

```text
Pomóż mi uruchomić lokalnie Finaro demo na moim komputerze z Windows.
Repozytorium: https://github.com/panbojek/finaro

Pobierz ten projekt do nowego folderu w wybranej lokalizacji.
Nie nadpisuj istniejących plików. Jeśli projekt jest już pobrany, rozpoznaj
jego folder i zapytaj przed zastąpieniem istniejącej kopii.
Jeżeli brakuje narzędzia do pobrania kodu, pomóż mi je zainstalować
lub pobierz i rozpakuj archiwum repozytorium.
Dalsze kroki wykonuj w pobranym folderze projektu.

Przeczytaj AGENTS.md, CLAUDE.md, README.md i docs/INSTALACJA.md.
Najpierw sprawdź środowisko i obecność Node.js 24 LTS lub zgodnej wersji.
Jeżeli czegoś brakuje, pomóż mi to zainstalować z oficjalnego źródła.
Przed instalacją wyjaśnij krótko, co zostanie dodane do komputera.
Nie zmieniaj globalnych zabezpieczeń Windows.

Uruchom istniejącą aplikację sposobem opisanym w projekcie.
Nie przebudowuj jej ani nie zmieniaj kodu tylko po to, żeby ją uruchomić.
Nie uruchamiaj npm install, jeśli projekt nie ma zależności do instalacji.
Sprawdź odpowiedź lokalnego serwera i podaj adres do otwarcia w przeglądarce.
Jeśli możesz, otwórz aplikację w przeglądarce.

Zachowaj dane syntetyczne i oddzielny magazyn FinaroDemo.
Nie proś o prawdziwy portfel ani klucz API. Niczego nie publikuj.
Jeśli uruchomienie się nie powiedzie, wyjaśnij komunikat i pomóż go rozwiązać.
Na koniec podaj pełną ścieżkę pobranego projektu oraz opisz, jak ponownie
uruchomić i zamknąć aplikację.
```

Po uruchomieniu otwórz **http://127.0.0.1:47832**. Powinien być widoczny baner **FINARO DEMO · DANE SYNTETYCZNE**. Potwierdzenie instalacji brakującego narzędzia może wymagać Twojego udziału.

## Zgody i zakończenie tego etapu

Claude Code może poprosić o dostęp do wybranego folderu, pobranie programu lub instalację Node.js. Zatwierdzaj czynności związane z pobraniem i lokalnym uruchomieniem Finaro. Jeśli prosi o klucz do notowań, prawdziwy portfel, publikację lub płatność, zatrzymaj ten krok: nie są potrzebne do demo.

Etap jest zakończony, gdy w przeglądarce widzisz fikcyjny portfel i baner demo, a asystent podał ścieżkę projektu. Czas zależy od instalacji narzędzi; sama odpowiedź „gotowe” nie zastępuje otwarcia aplikacji.

## Jak wrócić do właściwego projektu

Przy dalszym dostosowaniu kontynuuj tę samą rozmowę, polecając pracę w podanym folderze Finaro-demo. W nowej sesji otwórz właśnie ten folder jako projekt; w terminalu otwórz go w Eksploratorze, uruchom terminal i wpisz `claude`. Poproś asystenta o potwierdzenie pełnej ścieżki i przeczytanie instrukcji projektu, zanim zmieni pliki.

## Kolejne uruchomienia

Kliknij **kod/Uruchom-Finaro.cmd** w pobranym projekcie. Zakończenie: **Ustawienia → Zakończ Finaro**. Dalsze zmiany opisuje [instrukcja rozwoju](ROZWOJ.md).

## Chcesz przejść na własne dane?

Polecenie powyżej tylko uruchamia demo. Gdy je obejrzysz, użyj drugiego polecenia z [przewodnika własnego portfela](WLASNY-PORTFEL.md). Wtedy prosisz o dostosowanie kodu: usunięcie przykładów, wyłączenie symulacji i podłączenie prawdziwych wycen. Nie musisz sam wiedzieć, które pliki zmienić.

## Alternatywy

Możesz też użyć ChatGPT/Codex z lokalnymi narzędziami lub wybrać [instalację ręczną](INSTALACJA.md). Zwykły czat bez dostępu do komputera może udzielać wskazówek, ale sam nie uruchomi programu.
