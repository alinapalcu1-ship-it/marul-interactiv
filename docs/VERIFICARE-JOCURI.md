# Verificarea jocurilor — 14 octombrie 2026

- Build Vite de producție: reușit. Avertismentele Framer Motion privind use client nu împiedică buildul.
- Teste automate: 7/7 trecute (canal audio, asociere, perechi Memory, acoperirea exactă a imaginii de puzzle, toleranța de fixare, distribuția și regulile sortării).
- Asociere: toate cele trei personaje, ambele niveluri, răspuns greșit și corect, continuare.
- Puzzle: toate cele șase combinații personaj/nivel finalizate prin atingerea piesei și a locului.
- Memory: ambele niveluri finalizate în browser, inclusiv întoarcerea perechilor diferite și reluarea.
- Sortare: merele furnizate inspectate vizual; patru roșii și trei galbene în coșurile corecte; răspuns greșit încurajator, răspuns corect cu Bravo și confetti; reluare. Tragerea unui măr a fost verificată în timpul implementării.
- Muzică: pornește în jocuri, se oprește din comutator, se întrerupe pentru Bravo, revine după Bravo. La intrarea în poezie elementul audio al jocurilor este eliminat și rămâne numai audio-ul recitării.
- Încadrare în browser la 320×568, 390×844, 844×390, 768×1024, 1920×1080 și 3840×2160: activitățile nu produc depășiri ale paginii; comenzile verificate rămân în ecran.
- Integritate recitare: SHA-256 identic pentru toate cele 34 de fișiere protejate din recitare-inainte-jocuri.json. App.jsx primește doar callback-ul Acasă pentru PlayMode; stilurile jocurilor sunt separate.

## Limite

Rezoluțiile au fost emulate în browser. Nu s-a testat pe o tablă Samsung fizică sau pe toate browserele mobile. Nu există încă repository GitHub, deci publicarea și verificarea pe adresa GitHub Pages nu sunt realizate. Buildul păstrează căile relative pentru publicare în subdirector. Tragerea puzzle-ului are verificare logică pentru fixare; finalizarea tuturor puzzle-urilor a fost verificată prin alternativa tactilă.

## Completări din pachetul cu pagina de start

- 8/8 teste automate trecute; testul nou verifică reducerea graduală a volumului, anularea tranzițiilor concurente și revenirea la volumul de bază.
- În browser: home-intro pornește prin apăsare; se oprește înaintea poeziei/jocurilor. Titlul și subtitlul sunt cele cerute. Nu există muzică pe pagina de start.
- Sortarea pornește instrucțiunea nouă; după toate plasările, sursa vocală devine question-more-apples.mp3. Recompensa folosește bravo.mp3. Muzica rulează continuu, cu ducking, în locul pauzei bruște din versiunea anterioară.
- Pagina principală a fost reorganizată separat pentru telefon landscape. Home și sortarea: fără overflow sau comenzi în afara viewportului la toate cele șase dimensiuni cerute.
- Build de producție verificat efectiv la http://127.0.0.1:5189/marul/: imaginile sunt încărcate, introducerea se redă din calea relativă, trecerea la poezie funcționează, fără erori în consola filei de test.
- Cele 33 de fișiere ale vechii baze, în afară de HomeScreen.jsx modificat intenționat, sunt identice SHA-256. Recitarea, audio-poem.mp3, manifestul și stilurile sale nu au fost schimbate.
- Volumul perceptiv pe difuzoarele reale și particularitățile audio ale Safari/Samsung rămân de verificat pe dispozitive fizice. Testul fade-urilor este automat, nu o audiție pe tablă.

## Actualizare personaje 3D

- Inspectate vizual individual toate cele șase PNG-uri furnizate, păstrate fără editare.
- Build final și 8 teste automate: reușite.
- Verificat în browserul de producție, sub /marul/: toate cele șase imagini încărcate, variante neutre inițial, salut la atingere și în prezentarea audio, introducerea recitării, puzzle cu noua fetiță finalizat.
- Pagina principală verificată la 320×568, 390×844, 844×390, 768×1024, 1920×1080, 3840×2160: fără overflow sau personaje/comenzi în afara ecranului.
- Hash-urile fișierelor din public/assets/audio sunt identice înainte și după actualizare. Montajul audio-poem.mp3 și manifestul nu au fost editate. Efectele Bravo/confetti și managerul audio nu au fost modificate.
- Testarea pe dispozitive fizice Samsung/iOS rămâne necesară; rezoluțiile sunt emulate.
- Verificată și scena finală 7/7 cu noile variante de salut; consola nu raportează erori. Simbolul sănătății folosește o inimă cu bifă, pentru a elimina vechiul măr inclus în pictograma anterioară.
