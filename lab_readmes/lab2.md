### Użytkownik
- zamodeluj klasę zarządzającą zalogowanym użytkownikiem. Na ten moment chcemy mock zalogowanego użytkownika (bez opcji logowania, zakładania konta etc) //done
### Aktywny projekt
- Zrealizuj w aplikacji wybór "aktualnego" projektu. Czyli wybieram projekt, apka go zapamiętuje (api) i do czasu zmiany wszystko co widzę w aplikacji jest związane jedynie z tym projektem. //done
### Historyjki (funkcjonalności) projektu
- Zrealizuj CRUD do historyjki (funkcjonalności) w projekcie  
- Historyjki powinny się zapisywać za pośrednictwem zaprojektowanej poprzednio klasy do komunikacji z api //done
- Widok listy historyjek powininen dzielić historyjki na aktualnie wykonywane, czekające na wykonanie i zamknięte (lub jedna lista z filtrowaniem) //done

Model użytkownika: id, imię, nazwisko  //done
Model historyjki: id, nazwa, opis, priorytet (niski/średni/wysoki), projekt, data utworzenia, stan (todo/doing/done), właściciel (id użytkownika) //done