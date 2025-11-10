# Agent Dzienny — inteligentny organizator dnia

Nowoczesna aplikacja webowa, która działa jak osobisty asystent planowania. Agent analizuje listę zadań, priorytety, ramy czasowe oraz potrzeby regeneracji, a następnie proponuje zoptymalizowany harmonogram wraz z praktycznymi sugestiami.

## ✨ Kluczowe funkcje
- Automatyczne budowanie planu dnia na podstawie priorytetów i czasu trwania zadań
- Inteligentne podpowiedzi dbające o balans pomiędzy pracą a regeneracją
- Konfigurowalne ramy dnia, częstotliwość przerw i minimalne bloki głębokiej pracy
- Podział zadań na kategorie oraz szybkie oznaczanie wykonania
- Trwałe przechowywanie planu, ustawień i refleksji w `localStorage`

## 🚀 Uruchomienie lokalne
1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Wystartuj serwer deweloperski:
   ```bash
   npm run dev
   ```
3. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## 🧠 Jak działa agent
1. Dodaj zadania wraz z priorytetem, czasem trwania i opcjonalną godziną startu.
2. Ustal ramy dnia oraz preferencje dotyczące przerw i głębokiej pracy.
3. Agent zaproponuje harmonogram i wskaże zadania, które wymagają przeplanowania.
4. Pracuj z listą zadań, oznaczaj wykonanie i zapisuj refleksje, aby budować zdrowe rytuały.

## 🛠 Technologia
- [Next.js 14](https://nextjs.org) z App Routerem
- React + TypeScript
- Tailwind CSS

## 📦 Dostępne skrypty
- `npm run dev` — środowisko deweloperskie
- `npm run build` — budowanie wersji produkcyjnej
- `npm start` — uruchomienie zbudowanej aplikacji
- `npm run lint` — linting kodu
