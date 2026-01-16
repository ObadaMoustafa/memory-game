# Memory Match Master

Een gepolijst, full-stack Memory-kaartspel gebouwd met een focus op schone architectuur, gebruikersaanpassing en veilige authenticatie.

## 🛠️ Hoe te gebruiken

- **Download backend:** kloon de kant-en-klare Symfony API gemaakt door Mister [👉 Repo](https://github.com/hanze-hbo-ict/memory-backend) en voer deze uit.
- **Eerste opstart:** Open het `index.html` bestand in je browser.
- **Backend Configuratie:** De applicatie gebruikt `localhost:8000` als de standaard link naar de backend. Om dit te wijzigen, navigeer naar `js > modules > constants.js` en update de `SERVER_URL` variabele.
- **Configuratiebeheer:** Het `constants.js` bestand stelt je in staat om het volgende te beheren:
  - **Initiële Tijd:** De start countdown voor elk spel.
  - **Server URL:** Het primaire eindpunt voor API-communicatie.
  - **Kaartparen Hoeveelheid:** Het totale aantal kaartparen dat gegenereerd moet worden.
  - **API Link:** De externe URL die gebruikt wordt voor het ophalen van kaartafbeeldingen.

## 🚀 Kenmerken

- **Gebruikersauthenticatie:** Veilig Inloggen || Registreren systeem met JWT (JSON Web Tokens) met automatische afhandeling van sessieverloop.
- **Accountbeheer:** Gebruikers kunnen hun profielinformatie bijwerken, inclusief de mogelijkheid om hun **E-mailadres** te wijzigen.
- **Responsief Ontwerp:** Volledig geoptimaliseerd voor alle schermformaten, wat zorgt voor een naadloze ervaring op mobiel, tablet en desktop.
- **Dynamische Gameplay:** Interactief memoryboard met vloeiende animaties en "één-voor-één" kaartweergave.
- **Gepersonaliseerde Thema's:** Gebruikers kunnen kleuren voor "Gesloten Kaart" en "Gevonden Kaart" rechtstreeks vanuit hun profiel aanpassen.
- **Leaderboard & Geschiedenis:** Houd voortgang bij met een globaal topscoresbord en een gedetailleerde persoonlijke spelgeschiedenis.
- **API-integratie:** Dynamisch kaarten ophalen en paren genereren.

## ⚙️ Technologie-stack

- **Frontend:** Vanilla JavaScript (ES6+ Modules), HTML5, CSS3.
- **Backend:** Meegeleverde kant-en-klare PHP (Symfony/Aangepaste API).
- **Statusbeheer:** LocalStorage voor persistente gebruikerstoken, userId en gebruikersvoorkeuren.

> Je kunt inloggen met de inloggegevens van de initiële leden `gebruikersnaam: Henk` - `Pw: henk` of je kunt een nieuwe gebruiker registreren.
