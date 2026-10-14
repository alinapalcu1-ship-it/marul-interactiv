# Raport de verificare — Mărul

Verificări efectuate la 14 octombrie 2026, în browserul Chromium integrat.

## Rezultate

- Toate cele 10 imagini au fost deschise și inspectate vizual individual: merele roșu, verde și galben, personajul principal, mingea, codița, parfumul, inima, fetița și băiețelul.
- Cele 22 de fișiere imagine/audio din public/assets/ corespund exact arhivei furnizate (SHA-256). Fișierele PNG originale nu au fost reprocesate.
- Titlul oficial este „Mărul”; vechea denumire nu mai apare în codul interfeței.
- Introducerea separată afișează „Mărul” și cele trei personaje, fără număr de scenă.
- Înregistrarea are 28,996984 secunde conform metadatelor browserului.
- Cele 7 scene au fost accesate și verificate, inclusiv mingea și simbolul distinct al sănătății.
- La începutul scenei culorilor s-a observat doar Roșu; apoi Roșu + Verde; după al treilea moment au fost vizibile toate cele trei mere. Datele provin direct din manifest.
- Pauza a păstrat același currentTime și aceleași transformări ale imaginilor în două observații separate. Redă a continuat înregistrarea.
- Reia și „Mai ascult o dată” au revenit la introducere; Acasă și Joacă-te au oprit recitarea.
- Sunet oprit/pornit a modificat proprietatea muted a elementului audio.
- Interfața a răspuns la activarea și ieșirea din fullscreen.
- Toate cele 10 obiecte ale jocului au fost activate în browser. Imaginile sunt încărcate, grila mobilă are două coloane, fără depășire orizontală.
- Două teste Node au trecut: atingerile rapide opresc și derulează înapoi înregistrarea anterioară; obiectele fără voce opresc de asemenea răspunsul anterior.
- Buildul Vite de producție a reușit. Avertismentele bibliotecii Framer Motion despre directivele use client ignorate nu împiedică buildul.
- Buildul static a fost servit și verificat la /marul/: imaginile și MP3-ul se încarcă prin adrese relative. Redarea și ecranul final au funcționat.

## Încadrare

S-au verificat toate cele 7 scene pe fiecare dimensiune, inclusiv cu comenzile suplimentare din pauză. Măsurarea DOM nu a identificat imagini, versuri sau comenzi în afara viewportului și nici derulare a documentului în recitare.

| Dimensiune | Scene verificate | Depășiri |
|---|---:|---:|
| 320 × 568 | 7 | 0 |
| 390 × 844 | 7 | 0 |
| 844 × 390 | 7 | 0 |
| 768 × 1024 | 7 | 0 |
| 1920 × 1080 | 7 | 0 |
| 3840 × 2160 | 7 | 0 |

Schimbarea orientării a fost verificată în aceeași sesiune, fără reîncărcarea aplicației. Captura previzualizare-landscape.png arată scena codiței în pauză la 844 × 390.

## Limitele verificării

- Dimensiunile au fost simulate în browser; nu s-a testat pe un telefon fizic sau pe tabla Samsung. Atingerea reală, difuzoarele, particularitățile Safari și versiunea browserului tablei trebuie confirmate pe dispozitivele respective.
- Nu a fost verificată auditiv identitatea vocii; aplicația folosește fără modificări înregistrarea furnizată.
- Verificarea publică GitHub Pages nu a fost efectuată deoarece repository-ul nu există încă, conform confirmării utilizatorului. Testul local în subdirector nu este o publicare.
