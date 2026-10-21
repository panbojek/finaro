# Krótki słowniczek

- **Repozytorium** — folder z kodem programu, przykładami i instrukcjami. GitHub udostępnia go w internecie. Repozytorium Finaro demo nie jest miejscem na Twój rzeczywisty portfel.
- **Wersja programu** — pliki określające, jak działa aplikacja. Możesz zachować je przed zmianami i wrócić do ich wcześniejszej postaci. Nie jest to zapis Twoich produktów.
- **Magazyn danych** — osobny lokalny folder, w którym program zapisuje produkty, historię i ustawienia. Przy dostosowaniu ma pozostać poza folderem udostępnianego projektu.
- **Dane testowe** — fikcyjne pozycje, historia i ustawienia służące próbom dostosowanej wersji programu. Mają własny folder i kopie zapasowe. Przy ich otwarciu stale widzisz baner „DANE TESTOWE — nie wpisuj swoich finansów”. Nie służą do przechowywania rzeczywistych inwestycji.
- **Dane portfela** — Twoje rzeczywiste pozycje, historia i ustawienia, zapisane w osobnym folderze poza projektem. Przed rozpoczęciem używania są puste. Nie zawierają historii prób i nie pokazują banera danych testowych. Określenia te dotyczą wersji po dostosowaniu; obecna paczka pozostaje demem.
- **Kopia zapasowa danych** — zachowany wcześniejszy stan portfela. Pozwala cofnąć pomyłkę w danych, ale nie zmiany programu. [Przywracanie](KOPIE-ZAPASOWE.md).
- **Migracja danych** — zmiana sposobu zapisu danych, np. gdy nowa wersja programu potrzebuje dodatkowych informacji. Przed taką zmianą potrzebna jest kopia zapasowa i sprawdzenie odtworzenia. Asystent wykonuje tę pracę; użytkownik nie musi ręcznie zmieniać plików.
- **Klucz API** — prywatny kod dostępu do dostawcy notowań. W przygotowanej aplikacji wpisujesz go samodzielnie; nie wklejasz go do rozmowy ani repozytorium.
