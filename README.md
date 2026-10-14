# Mărul

Aplicația React + Vite existentă, actualizată cu imaginile și înregistrările furnizate. Animațiile folosesc Framer Motion. Nu sunt necesare conturi, servicii externe, fonturi online sau voci instalate în sistem.

## Pornire

Cu Node.js 22.12+ sau 24:

    npm install
    npm run dev

Alternativ: pnpm install și pnpm dev.

Build static:

    npm run build
    npm run preview

Teste pentru canalul audio al jocului:

    node --test

## Structură

- public/assets/ — cele 10 imagini transparente și înregistrarea completă.
- public/assets/audio/ — cele 11 fragmente MP3 individuale.
- manifest_timing_audio.json — sursa unică a timpilor pentru recitare.
- src/data/scenes.js — scene, etichete și căi relative pentru fișiere.
- src/App.jsx — navigare, audio principal, sunet și fullscreen.
- src/components/HomeScreen.jsx — titlul oficial „Mărul”.
- src/components/ScenePlayer.jsx — controlul redării și observarea ceasului audio.
- src/components/SceneArtwork.jsx — poziții calculate din timpul audio.
- src/components/ControlBar.jsx și ProgressDots.jsx — comenzi și progres.
- src/components/PlayMode.jsx și src/games/ — meniul și cele patru jocuri educaționale.
- src/clip-player.js — un singur canal pentru vocile jocului.
- src/styles.css — organizare pentru portret, landscape și ecrane mari.
- tests/audio.test.js — prevenirea suprapunerii vocilor.
- .github/workflows/pages.yml — publicare pe GitHub Pages.
- docs/VERIFICARE.md — verificările efectuate și limitele lor.

## Sincronizare

Aplicația importă direct manifestul furnizat; nu dublează timpii într-un alt tabel. Introducerea durează până la 2,636 secunde și nu este numerotată. Cele 7 scene păstrează imaginile în pauzele dintre cuvinte.

Merele apar la 5,995, 8,131 și 10,424 secunde. Efectul parfumului se schimbă la 23,686 secunde. Durata înregistrării măsurată de browser este 28,996984 secunde.

requestAnimationFrame doar citește audio.currentTime; nu adună un timp independent. Pozițiile, rotația, săriturile, apropierea de codiță și opacitatea sunt funcții ale acelui timp. La pauză, ceasul și pozițiile rămân nemodificate. Reluarea nu recitește de la început versul. Comanda Reia revine la titlu.

Jocurile folosesc confirmări sonore scurte și înregistrarea Bravo furnizată. Muzica de fundal se oprește la ieșirea din secțiune.

## Telefoane și tabla interactivă

Recitarea ocupă 100dvh, cu fallback 100vh și safe-area. Nu necesită derulare. În portret, culorile și personajele se reorganizează pe două rânduri. În landscape, titlul și comenzile ocupă mai puțin spațiu. În timpul redării apar Pauză și Acasă; Reia și Joacă-te apar în pauză. La final apar „Mai ascult o dată” și „Joacă-te”.

Butonul „Ecran complet” este disponibil când browserul declară suport pentru Fullscreen API. Pe dispozitive fără acest suport, aplicația folosește în continuare spațiul disponibil. Activitățile se reorganizează în funcție de orientare; meniul afișează opțiunile vertical pe telefon.

## GitHub Pages

Nu există încă un repository GitHub pentru acest proiect; aplicația nu a fost publicată.

1. Creează un repository și încarcă sursele, manifestele, public/, fișierele package/pnpm, configurația Vite și .github/.
2. Folosește ramura main sau adaptează numele din workflow.
3. În Settings → Pages, selectează GitHub Actions.
4. Rulează workflow-ul „Publică Mărul” sau trimite modificările pe main.
5. Verifică adresa indicată de jobul de publicare, inclusiv audio, pauza, culorile și jocul.

Vite folosește base: './'. Toate imaginile și înregistrările folosesc aceeași bază, astfel încât aplicația poate funcționa și într-un subdirector de repository. Nu este necesară o regulă de rescriere pentru rutare.

marul-github-pages.zip conține buildul static; marul-react.zip conține proiectul sursă. Nu include node_modules/ în repository.

## Jocurile educaționale — actualizare

Galeria a fost înlocuită cu patru activități: Găsește perechea!, Puzzle vesel, Cine se ascunde? (Memory) și Surpriza merelor!. Componentele și stilurile lor sunt în src/games/, iar meniul este în src/components/PlayMode.jsx.

Asocierea și Memory au două niveluri. Puzzle-ul oferă cele trei personaje originale și două sau trei piese, cu selectare prin atingere și fixare prin tragere. Jocul surpriză sortează patru mere roșii și trei galbene, apoi cere compararea vizuală a coșurilor, fără cifre afișate.

Imaginile pentru sortare sunt în public/assets/game/. Înregistrarea bravo.mp3 și play-background-music.mp3 provin din arhiva furnizată. Muzica rulează la volum redus numai în Joacă-te, are comutator propriu, respectă Sunet oprit, scade lin în timpul vocilor și se oprește la ieșire. Recitarea și resursele ei sunt păstrate.

Raport actualizat: docs/VERIFICARE-JOCURI.md. Teste: node --test.


## Prezentare audio pe pagina principală

Butonul „Ascultă prezentarea” redă public/assets/audio/home-intro.mp3 numai la atingere. La apăsare repetată repornește de la început, respectă Sunet oprit și se oprește la ieșirea din pagina principală. Nu există muzică pe pagina de start. Verificat în browser: durata 5,407 secunde, fără autoplay, pornire, dezactivare sunet și trecere către ambele secțiuni. Poezia și jocurile nu au fost modificate pentru această actualizare.


## Actualizare completă a pachetului audio

Sortarea redă instruction-sort-apples.mp3 la pornire și question-more-apples.mp3 numai după toate plasările. Butonul Ascultă din nou repetă cerința etapei. useGameAudio.js gestionează un singur canal vocal și muzica de fundal: volum de bază 0,14, reducere la 0,025 în 300 ms, revenire în 750 ms. Tranzițiile precedente se anulează; întrebarea și Bravo așteaptă vocea în curs. La ascunderea filei audio se pune pe pauză. Muzica furnizată, inclusiv conținutul vocal al ei, nu a fost modificată.

Pagina principală și sortarea au fost verificate la cele șase rezoluții cerute, fără depășirea ecranului. Pentru simularea locală a GitHub Pages: npm run build, apoi node scripts/preview-pages.mjs și deschide http://127.0.0.1:5189/marul/. Acesta este un server local de verificare, nu o publicare.

## Personajele 3D noi

Cele șase imagini originale sunt în public/assets/characters/: apple/girl/boy, fiecare cu neutral și wave. CharacterSprite preîncarcă și decodează setul, apoi suprapune variantele într-un cadru fix cu object-fit: contain și tranziție de opacitate. Atingerea salută timp de aproximativ două secunde; prezentarea audio activează salutul pe durata redării. În recitare, amestecul imaginilor este calculat din timpul audio, fără cronometru independent.

Noile modele apar și în asociere, Memory și puzzle. Piesele puzzle păstrează proporțiile imaginilor portret. Codița evidențiată aparține noului măr, fără o a doua codiță suprapusă. Merele realiste și toate fișierele audio rămân neschimbate.
