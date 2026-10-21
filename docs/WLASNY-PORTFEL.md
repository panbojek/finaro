# Od demo do własnego portfela z pomocą Claude Code

Repozytorium, czyli folder z kodem i instrukcjami pobrany z GitHuba, jest punktem startowym. Najpierw oglądasz aplikację na fikcyjnych danych. Gdy chcesz używać jej dla siebie, prosisz Claude Code o przygotowanie Twojej wersji programu: usunięcie przykładów, wyłączenie symulacji i dodanie rzeczywistych źródeł wyceny.

**To jednorazowe dostosowanie kodu, a nie przełącznik dostępny w obecnym demo.** Nie musisz sam programować integracji, ale trzeba ją wykonać i sprawdzić. Samo usunięcie wierszy z produktami lub wpisanie klucza nie wystarcza.

## 1. Obejrzyj demo

Uruchom aplikację według [polecenia startowego](URUCHOMIENIE-Z-AI.md). Zobacz podsumowanie, wykresy, produkty i alerty. Możesz swobodnie zmieniać fikcyjne dane. Nie potrzebujesz konta EODHD.

## 2. Poproś o przygotowanie Twojej wersji programu

Wykonuj kroki w tej kolejności:

1. Wklej **polecenie główne** poniżej. Asystent przygotuje program i osobne dane testowe.
2. Po zakończeniu prac wklej [polecenie podsumowania](#podsumowanie-prac).
3. Wykonaj [trzy samodzielne sprawdzenia](#co-sprawdzasz-samodzielnie), w tym próbę na danych testowych.
4. Jeśli chcesz dodatkowej kontroli, zleć [opcjonalny przegląd w nowej sesji](#opcjonalny-przegląd-w-nowej-sesji).
5. Dopiero potem przejdź do [jednej rzeczywistej pozycji](#3-zacznij-od-jednej-pozycji).

### Polecenie główne

Otwórz pobrany folder Finaro-demo w Claude Code — [jak wrócić do projektu](URUCHOMIENIE-Z-AI.md#jak-wrócić-do-właściwego-projektu). Najpierw poproś o potwierdzenie pełnej ścieżki.

**Ty** określasz potrzebę i oceniasz efekt. **Claude Code** zmienia program, przygotowuje zabezpieczenie poprzedniej wersji i sprawdza działanie na fikcyjnych danych. Poniższe polecenie zleca mu te czynności. Nie zobowiązuje Cię do wpisania prawdziwego portfela ani kupienia abonamentu.

Wklej:

```text
Chcę przejść od Finaro demo do aplikacji dla mojego własnego portfela.
Przeczytaj instrukcje projektu i docs/WLASNY-PORTFEL.md.

Przygotuj moją wersję programu do codziennego używania.
Nie dodawaj ekranu wyboru Demo / Mój portfel.
Przed zmianami zachowaj dotychczasową wersję programu w osobnym folderze,
bez sekretów i danych finansowych. Podaj pełną ścieżkę i sposób powrotu.
Zachowaj kopię zapasową dotychczasowych danych demo, bez ich odczytywania.
Przygotuj dwa oddzielne foldery poza projektem: dane testowe i dane portfela,
z osobnymi kopiami zapasowymi. Dane portfela mają pozostać puste po próbach.
Dane testowe oznacz na każdym ekranie stałym, niezamykanym banerem:
„DANE TESTOWE — nie wpisuj swoich finansów”, także po ponownym uruchomieniu.
Przy danych portfela tego banera nie może być. Podaj sposób otwarcia obu.
Sprawdź rozdzielenie folderów; nie przenoś testowych wycen ani kopii.
Nie usuwaj automatycznie danych testowych — użytkownik mógł się pomylić.

Usuń przykładowe produkty, fikcyjną historię i alerty z użytkowanej wersji.
Wyłącz automatyczne wczytywanie przykładów i generator cen.
Zmodyfikuj reset tak, żeby nie przywracał fikcyjnego portfela.
Nie pozwól, aby symulowane ceny aktualizowały moje prawdziwe pozycje.
Publiczne pliki z przykładami mogą pozostać do testów, ale nie mogą być
źródłem danych mojej aplikacji ani miejscem zapisywania moich finansów.

Przygotuj ręczne dodawanie i wycenę moich produktów oraz integrację EODHD
dla obsługiwanych akcji i ETF-ów. Najpierw zweryfikuj oficjalne warunki Free,
symbole, giełdy, waluty i daty cen. Wprowadź dzienny limit i zapis pobranych
cen, aby kolejne otwarcie nie pobierało ponownie tych samych danych.
Przy błędzie zachowaj poprzednią wycenę i pokaż zrozumiały komunikat.

Klucz chcę wpisać samodzielnie w chronionym polu aplikacji.
Nie proś o wklejenie go do czatu i nie zapisuj go w kodzie ani w logach.
Dane portfela, klucz i kopie mają pozostać poza repozytorium.
Nie odczytuj moich istniejących prywatnych portfeli. Do testów użyj fikcyjnych
pozycji. Dane rzeczywiste wprowadzę sam po przygotowaniu aplikacji.

Zachowaj historię zapisanych wycen, automatyczne kopie i ich odtwarzanie.
Usuń lub opisz jako niedostępne fikcyjne alerty; rzeczywistych raportów
i dywidend nie wolno oznaczać jako sprawdzanych bez wdrożenia ich źródeł.
Zmień oznaczenia demo dopiero zgodnie z faktycznym zachowaniem aplikacji.

Sprawdź zapis, ponowne uruchomienie, wycenę, limit i odtworzenie kopii.
Na koniec podaj krótką instrukcję pierwszego użycia oraz ograniczenia.
Nie publikuj zmian, nie wysyłaj moich danych i nie uruchamiaj płatnych usług.
```

### Co zatwierdzasz i po czym poznać zakończenie

Asystent może zapytać o źródło notowań, obsługiwane rodzaje produktów i instalację narzędzi. Wyjaśniaj potrzeby; dobór technicznego rozwiązania należy do niego. Nie wklejaj klucza ani wyciągów do rozmowy. Nie zatwierdzaj publikacji lub kosztów w ramach tego zadania.

Nie da się uczciwie obiecać stałego czasu: zakres zależy od instrumentów i problemów integracji. Gdy asystent utknie, nie proś o przypadkowe dalsze zmiany — użyj [instrukcji rozwiązywania problemów](PROBLEMY.md#po-dostosowaniu-do-własnego-portfela).

### Podsumowanie prac

Przed przyjęciem efektu wklej:

```text
Pokaż podsumowanie zmian względem zachowanej wersji programu:
co działa, czego nie wdrożyłeś, jakie testy wykonałeś i jak wrócić.
Wskaż foldery zapisu danych i klucza, bez otwierania ich zawartości.
Wyjaśnij, jak kod oddziela je od plików przeznaczonych do udostępnienia.
```

Nie musisz czytać każdej linii kodu. Obejrzyj działający program i sprawdź, czy odpowiada uzgodnionemu zakresowi. Sama deklaracja asystenta nie wystarcza — wykonaj poniższe sprawdzenia przed wpisaniem finansów.

### Co sprawdzasz samodzielnie

- Przy pierwszym starcie przygotowanej wersji lista produktów i historia są puste. Nie widzisz przykładowych spółek, fikcyjnych cen ani alertów.
- Asystent podał pełną ścieżkę folderu programu oraz osobne ścieżki danych i klucza. Porównaj je w Eksploratorze: folder danych nie może znajdować się wewnątrz folderu projektu. Nie otwieraj plików z sekretem lub portfelem.
- Próbę zapisu, zamknięcia programu i odtworzenia kopii wykonaj na **danych testowych**. Na każdym ekranie musi być widoczny baner **„DANE TESTOWE — nie wpisuj swoich finansów”**. Po próbie zakończ program i otwórz **dane portfela** według instrukcji asystenta. Sprawdź brak banera testowego, osobny folder oraz pustą listę produktów, historię i alerty. Nie przenoś wycen ani kopii z prób.

Nie wiesz, które dane są otwarte, albo pomyliłeś je podczas wpisywania? Zatrzymaj dalsze zmiany i skorzystaj z [instrukcji rozpoznania danych i zabezpieczenia pomyłki](PROBLEMY.md#nie-wiem-czy-mam-otwarte-dane-testowe-czy-dane-portfela). [Znaczenie obu nazw](SLOWNICZEK.md).

### Opcjonalny przegląd w nowej sesji

Te czynności nie dowodzą pełnego bezpieczeństwa kodu. Jeśli potrzebujesz dodatkowej kontroli, otwórz nową sesję Claude Code we właściwym folderze i zleć przegląd **przed wpisaniem rzeczywistych danych i klucza**:

```text
Sprawdź niezależnie kod przygotowanej wersji Finaro oraz wyniki testów.
Nie zmieniaj programu. Nie otwieraj folderów z portfelem, kluczem ani kopiami.
Sprawdź, gdzie kod zapisuje dane i sekret, czy nie zapisuje ich do plików
programu lub logów i czy symulacja nie może wyceniać rzeczywistych pozycji.
Sprawdź zakres testów nowych integracji i zgłoś luki z lokalizacją w kodzie.
Nie traktuj podsumowania poprzedniego asystenta jako dowodu poprawności.
```

To dodatkowy przegląd, nie gwarancja bezpieczeństwa. [Wyjaśnienia pojęć](SLOWNICZEK.md).

Dostosowanie jest gotowe do Twojej próby dopiero wtedy, gdy program otwiera pusty portfel, symulacja jest wyłączona, zapis i kopie działają, a asystent wskazuje wyniki testów nowych funkcji i znane ograniczenia. **Testy dołączone do repozytorium dotyczą demo; ich zaliczenie nie potwierdza nowej integracji.** Nowe pobieranie cen, limity, błędy i obliczenia wymagają osobnych sprawdzeń na fikcyjnych danych. Test jednej rzeczywistej pozycji poniżej jest kolejnym etapem.

Claude Code powinien przygotować dostosowanie i wyjaśnić wynik. Jeśli dostęp do konkretnego instrumentu lub źródła jest niepotwierdzony, powinien to oznaczyć, zamiast udawać poprawną wycenę. Przygotowanie rzeczywistych alertów jest osobnym zakresem niż samo pobieranie cen.

## 3. Zacznij od jednej pozycji

Po przygotowaniu aplikacji wprowadź jedną ze swoich pozycji **bezpośrednio w jej formularzu**. Podaj nazwę, rachunek, liczbę jednostek, wpłacony kapitał i obecną wartość. Dla ceny automatycznej potrzebny jest właściwy symbol, giełda i waluta. Nieznanej daty pierwszego zakupu nie zgaduj.

Jeśli korzystasz z EODHD, załóż własne konto na [eodhd.com](https://eodhd.com/) i wpisz klucz w przygotowanym polu aplikacji. Mały portfel aktualizowany raz dziennie może zmieścić się w darmowym planie. Zasady i limity opisuje [instrukcja EODHD](EODHD.md).

EODHD dostarcza ceny, a nie listę Twoich inwestycji. Ilości, kapitał i zakupy aktualizujesz osobno. Produkty bez źródła rynkowego mogą pozostać przy wycenie ręcznej.

## 4. Sprawdź, czy możesz zaufać tej konfiguracji

Przed dodaniem reszty portfela przejdź krótki test:

1. **Wycena:** sprawdź źródło, datę i walutę ceny. Cena po zakończeniu sesji nie musi odpowiadać cenie pokazywanej w tej chwili przez brokera.
2. **Obliczenie:** porównaj wartość z liczbą jednostek pomnożoną przez cenę; przy obcej walucie uwzględnij podany kurs do PLN. Sprawdź również kapitał, zysk i procent.
3. **Zapis:** zakończ aplikację i uruchom ponownie. Pozycja i ustawienia powinny pozostać zapisane. Klucza nie powinno być trzeba wpisywać przy każdym starcie.
4. **Kopia zapasowa danych:** wykonaj niewielką, rozpoznawalną korektę i przywróć stan sprzed niej według [instrukcji kopii](KOPIE-ZAPASOWE.md). Sprawdź efekt przed dalszymi wpisami.
5. **Jasność danych:** upewnij się, że nie ma fikcyjnej historii, wiadomości ani cen. Brak danych ma być opisany jako brak danych.

To test poprawności konfiguracji, nie zapewnienie zgodności każdego rynku i instrumentu. Nie przenoś większej ewidencji, dopóki nie wyjaśnisz rozbieżności.

## 5. Dodaj pozostałe produkty

Wprowadź resztę pozycji. Ten sam ETF na różnych rachunkach zachowaj jako osobne pozycje; samej sumy IKE nie dodawaj ponownie jako kolejnego produktu.

Historia własnego portfela zaczyna się od zapisanych rzeczywistych wycen. Nie dziedziczy przykładowych wykresów demo. Początkowo jeden punkt jest prawidłowy. Jeżeli podasz kapitał 1000 zł i wartość 1100 zł, wynik wyniesie 10%: obejmuje wcześniejszy zysk, a nie tylko okres od uruchomienia aplikacji.

## Co pozostaje prywatne?

Twoje produkty, kwoty, historia, klucz i kopie pozostają lokalnie poza repozytorium. Nigdy nie zastępuj nimi publicznego demo/portfolio.json. Polecenie do Claude Code dotyczy przygotowania programu; rzeczywiste finanse i sekret wpisujesz w programie samodzielnie.

Tak przygotowana wersja programu nadal działa lokalnie. Udostępnianie jej w internecie wymaga odrębnego przygotowania dostępu i ochrony danych.
