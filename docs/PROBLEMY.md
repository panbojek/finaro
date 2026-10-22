# Rozwiązywanie problemów

| Objaw | Co zrobić |
|---|---|
| Po kliknięciu widzę treść .cmd | Otwórz folder w Eksploratorze i uruchom plik dwuklikiem, zamiast otwierać w edytorze. |
| Komunikat o braku Node.js | Zainstaluj Node.js 24 LTS (co najmniej 24.22.1) z nodejs.org i otwórz ponownie Eksplorator. W terminalu `node --version` powinno pokazać wersję 24.22.1 lub nowszą z gałęzi 24 LTS. |
| Otworzyłem index.html i nic nie zapisuje | Zamknij tę kartę i uruchom kod/Uruchom-Finaro.cmd. Adres powinien zaczynać się od http://127.0.0.1:47832. |
| Port jest zajęty lub otwiera się inny program | Zakończ stare demo przez jego ustawienia. Nie zabijaj losowych procesów. Poproś AI o sprawdzenie portu 47832 bez odczytu prywatnych danych. |
| Nie widzę ostatniej zmiany kodu | Odśwież F5. Po zmianach serwera zakończ aplikację i uruchom ją ponownie. |
| Dane zmieniły się w innym oknie | Odśwież widok przed ponownym zapisem. Nie zapisuj automatycznie starego formularza. |
| Automatyczna cena wygląda inaczej niż giełdowa | To generator demo. Fikcyjne symbole nie mają rzeczywistych notowań. |
| Edycja portfolio.json niczego nie zmieniła | Dane z pierwszego uruchomienia są już zapisane lokalnie. Użyj Przywróć dane demonstracyjne po potwierdzeniu. |
| Brak wpisanej wcześniej pozycji po resecie | Reset zastępuje stan demo. Sprawdź wcześniejszą kopię w Ustawieniach. |
| Nie można odczytać danych lub kopii | Użyj tego samego konta Windows. Sprawdź listę kopii; uszkodzenie nie powinno nadpisywać pliku pustym portfelem. |

Zgłaszając błąd, podaj wersję Windows, wersję Node, czynność i komunikat. Dodaj fikcyjny przykład zamiast prawdziwego portfela. Zrzuty ekranu i eksporty również mogą zawierać dane finansowe. W tym projekcie testuj na przykładach z paczki.

## Po dostosowaniu do własnego portfela

### Claude Code utknął lub zmienił zbyt dużo

Przerwij zlecanie kolejnych zmian i nie wpisuj rzeczywistych danych. Wklej:

```text
Porównaj efekt z uzgodnionym zakresem i zachowaną wersją programu.
Opisz błąd na fikcyjnym przykładzie. Nie odczytuj mojego portfela ani klucza.
Nie zmieniaj niczego poza niezbędną poprawką.
```

Przekaż komunikat błędu bez danych finansowych. Jeśli brakuje wymaganego dostępu lub źródła, asystent powinien wskazać konkretną przeszkodę.

### Nie zgadza się wartość lub wynik

Nie dodawaj kolejnych produktów i nie polegaj na tej wycenie. Sprawdź liczbę jednostek, kapitał, datę i walutę ceny oraz przeliczenie na PLN. Poproś o test na fikcyjnej pozycji o znanym wyniku, np. kapitał 1000 zł, wartość 1100 zł, zysk 100 zł i wynik 10%. Dotychczasowe testy demo nie potwierdzają poprawności nowego połączenia z dostawcą.

### Chcę cofnąć zmiany w programie

1. Zakończ zmodyfikowany program. Zachowaj jego folder; nie usuwaj danych ani klucza.
2. Poproś Claude Code o wskazanie folderu **wersji programu zachowanej przed dostosowaniem**. Ścieżkę powinien podać przed rozpoczęciem prac.
3. Wklej polecenie poniżej. Powrót do demo pozwala ponownie obejrzeć przykłady; nie przenosi do niego rzeczywistych pozycji.
4. Jeżeli nie ma zachowanej wersji, poproś o ponowne pobranie wydania demo do nowego folderu. Nie nadpisuj uszkodzonej wersji i nie podłączaj nowego demo do rzeczywistych danych.

Polecenie do kroku 3:

```text
Uruchom zachowaną wersję programu. Najpierw sprawdź, że nie otwiera
folderu danych mojego portfela i nie zmienia formatu zapisanych danych.
Zachowaj obecną wersję programu bez nadpisywania.
```

### Chcę cofnąć pomyłkę w danych

Gdy program działa poprawnie, ale np. wpisałeś złą kwotę, użyj [kopii zapasowej danych w Ustawieniach](KOPIE-ZAPASOWE.md). Odtwarza cały zapisany stan portfela. **Nie naprawia i nie cofa kodu programu.** Jeśli zmienił się format danych, najpierw poproś asystenta o sprawdzenie zgodności wersji bez odczytu rzeczywistych finansów.

### Nie wiem, czy mam otwarte dane testowe, czy dane portfela

Nie dodawaj produktów, nie uruchamiaj resetu i nie usuwaj folderów. Przy danych testowych na każdym ekranie powinien być baner **„DANE TESTOWE — nie wpisuj swoich finansów”**. Sam brak banera nie dowodzi poprawnej konfiguracji. Jeżeli oznaczenia są niejasne lub nie zgadzają się z instrukcją, wklej:

```text
Nie wiem, czy otwarte są dane testowe, czy dane portfela.
Bez odczytu ich zawartości sprawdź konfigurację uruchomienia, folder zapisu
oraz powiązanie banera z używanymi danymi. Nie zmieniaj ani nie usuwaj danych.
Wskaż, które dane są otwarte, i podaj sposób otwarcia danych portfela.
Jeśli oznaczenia są błędne, popraw je i sprawdź na fikcyjnych danych.
```

### Wpisałem prawdziwe pozycje do danych testowych

1. Przerwij dalsze wpisywanie. Nie usuwaj pozycji ani folderu, nie resetuj i nie przywracaj wcześniejszej kopii — mogłoby to zastąpić potrzebne wpisy.
2. Zakończ program. Poproś asystenta o zabezpieczenie całego folderu danych testowych wraz z kopiami, **bez otwierania ich zawartości**, w trwałej lokalizacji poza projektem i folderami tymczasowymi. Niczego nie nadpisuj. Kopia nadal wymaga odpowiedniego profilu Windows; samo skopiowanie nie daje przenośności między komputerami.
3. Gdy asystent potwierdzi wykonanie zabezpieczenia, ustal z nim sposób lokalnego otwarcia zachowanych wpisów. Nie przesyłaj kwot, eksportów ani klucza do czatu. Jeśli podczas próby użyłeś klucza, poproś także o zabezpieczenie jego zapisu bez ujawniania wartości.
4. Właściwe dane portfela uzupełnij samodzielnie w aplikacji, porównując z własnymi rachunkami. Nie przenoś całej historii testowej do danych portfela. Eksport do analizy nie jest pełną kopią zapasową ani obietnicą automatycznego importu.
5. Zabezpieczenie zachowaj, dopóki nie sprawdzisz kompletności wpisów, ponownego uruchomienia i kopii zapasowych danych portfela. Porządkowanie danych testowych wykonuj dopiero świadomie po tej kontroli.

### Wpisałem fikcyjną pozycję do danych portfela

Usunięcie pozycji nie czyści jej historii. Jeśli dane portfela były wcześniej puste, przywróć cały pusty stan z potwierdzonej kopii zapasowej sprzed próby. Jeżeli takiej kopii nie ma, poproś asystenta o przygotowanie nowego, oddzielnego pustego folderu danych portfela, bez usuwania lub nadpisywania istniejących zapisów. Sprawdź puste produkty, historię i alerty.

Jeżeli masz już zapisane własne pozycje, nie wracaj do pustego stanu. Najpierw zabezpiecz obecne dane, a następnie ustal z asystentem sposób cofnięcia pomyłki bez utraty rzeczywistych wpisów i bez przekazywania mu ich treści.
