### Powiadomienia
- Zaprojektuj serwis powiadomień w aplikacji. Serwis (klasa) jako minimum powinien udostępniać w swoim API metody: //done
```js 
send(notification: Notification)    // wysłanie powiadomienia
list():Observable<Notification[]>   // lista powiadomień
unreadCount(): Observable<number>   // licznik nieprzeczytanych powiadomień
```
(oczywiście możesz zamodelować klasę wg własnego pomysłu:))
- Zaimplementuj komponent licznika nieprzeczytanych powiadomień (np. na pasku nawigacji). //done
- Zaimplementuj komponent widoku wszystkich powiadomień (np. po kliknięciu w licznik) //done
- Zaimplementuj komponent okna dialogowego z powiadomieniami (pokazuje się od razu przy wysłaniu powiadomienia, tylko dla powiadomień o prority 'medium' i 'high') //done
- Emituj powiadomienia przy przypisaniu nowego elementu (projektu/story/taska) do użytkownika //done

### RxJS
- Użyj biblioteki RxJS by zamodelować listę oraz licznik powiadomień jako strumienie. //done

#### Model powiadomienia
```js
type ISOString = string
type Notification = {
  title: string,
  message: string,
  date: ISOString,
  prority: 'low'|'medium'|'high',
  read: boolean
  }
```
