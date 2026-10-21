# Jak udostępnić paczkę na GitHubie

Przygotowanie tej paczki nie publikuje niczego automatycznie. Utwórz własne repozytorium, gdy będziesz gotowy udostępnić kod.

## Autorstwo i pierwszy commit

Publikuj zawartość czystej paczki jako nowe repozytorium, z **jednym początkowym commitem**. Nie wysyłaj lokalnej historii roboczej. Wpisz własne imię i nazwisko oraz dokładny adres **noreply** z GitHub → Settings → Emails jako autora i osobę zapisującą commit. Nie używaj danych asystenta ani zgadywanego adresu.

Przy publikacji przez przeglądarkę sprawdź ustawienia prywatności adresu e-mail na GitHubie. Przy użyciu Git lub GitHub Desktop ustaw te dane tylko dla nowego repozytorium przed pierwszym commitem. Czysty ZIP nie zawiera historii Git; dodanie całej jego zawartości jednorazowo pozwala rozpocząć nową historię bez kolejnych poprawek roboczych.

## Przez przeglądarkę

1. Rozpakuj przygotowany ZIP. Na najwyższym poziomie powinny być README.md, LICENSE, package.json oraz katalogi kod, demo, docs, scripts i tests.
2. Zaloguj się do GitHuba i wybierz utworzenie nowego repozytorium. Ustal nazwę, np. finaro-demo, oraz widoczność. Na start wybierz **Private**; widoczność Public ustaw dopiero po przeglądzie.
3. Nie dodawaj drugiego README ani osobnej licencji w kreatorze, jeśli za chwilę prześlesz te z paczki.
4. Na stronie repozytorium wybierz przesłanie istniejących plików / **Add file → Upload files**. Dodaj zawartość rozpakowanego katalogu. Nie przesyłaj samego ZIP jako zamiennika kodu.
5. Przejrzyj listę. Mają to być wyłącznie pliki paczki, bez magazynu danych, kopii, eksportów i notatek prywatnego projektu.
6. Zatwierdź przesłanie. README pojawi się na stronie głównej.
7. Pobierz własne repozytorium przez Code → Download ZIP i sprawdź instrukcję instalacji. Dopiero potem rozważ zmianę widoczności na Public.

Przy większej liczbie plików lub ograniczeniach przeglądarki wygodniejszy jest GitHub Desktop. Szczegóły przesyłania i limity: [GitHub Docs](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## GitHub Desktop

Zainstaluj aplikację z oficjalnej strony desktop.github.com, zaloguj się i dodaj lokalne repozytorium rozpakowanej paczki (lub utwórz repozytorium z tych plików). Sprawdź różnice, wykonaj pierwszy commit i wybierz publikację ze świadomie wybraną widocznością. Nie dodawaj folderów danych z AppData.

## Lista przed publikacją

- Uzupełniony rzeczywisty adres repozytorium w docs/URUCHOMIENIE-Z-AI.md zamiast pola na link.
- Wyłącznie fikcyjne dane w demo/portfolio.json, żadnych zrzutów rachunków.
- Brak kluczy, danych logowania, plików .enc, eksportów i logów.
- Nowa historia repozytorium obejmuje jeden początkowy commit oczyszczonej edycji demo, z własnym imieniem i nazwiskiem oraz adresem GitHub noreply.
- Przeczytana licencja kodu i zasady znaków marki w ASSETS.md.
- Uruchomione `npm test` i ręczny spacer po aplikacji.
- Jasno widoczny zakres symulacji i wymagania Windows/Node.

Publikacja repozytorium nie uruchamia aplikacji w internecie. Odbiorca pobiera projekt i uruchamia go lokalnie według instrukcji.
