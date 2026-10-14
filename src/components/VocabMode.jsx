import { useEffect, useRef, useState } from 'react';
import { imagePath } from '../data/scenes';
import './vocabulary.css';

// Exactly the words spoken in the ten new Antonia recordings.
// Audio files live in public/assets/vocabulary/ and are uploaded separately.
const recordings = {
  instructiune: { text: 'Atinge o imagine. Ascultă cuvântul. Repetă.', file: 'instructiune.mp3' },
  mar: { text: 'Măr', file: 'mar.mp3', image: 'apple' },
  codita: { text: 'Codiță', file: 'codita.mp3' },
  frunza: { text: 'Frunza', file: 'frunza.mp3' },
  rosu: { text: 'Măr roșu', file: 'mar-rosu.mp3', image: 'red' },
  verde: { text: 'Măr verde', file: 'mar-verde.mp3', image: 'green' },
  galben: { text: 'Măr galben', file: 'mar-galben.mp3', image: 'yellow' },
  minge: { text: 'Minge', file: 'minge.mp3', image: 'ball' },
  intrebare: { text: 'Ce culoare are mărul?', file: 'intrebare-culoare.mp3' },
  altele: { text: 'Alte cuvinte din poezie.', file: 'alte-cuvinte.mp3' },
};
const recordingUrl = name => import.meta.env.BASE_URL + 'assets/vocabulary/' + recordings[name].file;

function WordPicture({ word, active, play }) {
  const item = recordings[word];
  return <button className={'vocab-picture-word' + (active ? ' vocab-chosen' : '')}
    type="button" onClick={() => play(word)}
    aria-label={'Ascultă: ' + item.text} aria-pressed={active}>
    <img src={imagePath(item.image)} alt="" draggable="false"/>
    <span className="vocab-picture-label">{item.text} <span aria-hidden="true">♪</span></span>
  </button>;
}

function SpokenHeading({ id, title, recording, play }) {
  return <div className="vocab-heading-row">
    <h2 id={id}>{title}</h2>
    <button className="vocab-heading-audio" type="button" onClick={() => play(recording)}
      aria-label={'Ascultă: ' + recordings[recording].text}>🔊 <span>Ascultă</span></button>
  </div>;
}

export default function VocabMode({ sound, onHome, onListen, onPlay }) {
  const audio = useRef(null);
  const [chosen, setChosen] = useState(null);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const item = chosen && recordings[chosen];

  useEffect(() => {
    const track = audio.current;
    const onHidden = () => { if (document.hidden) { track.pause(); setSpeaking(false); } };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      track.pause();
      track.removeAttribute('src');
      track.load();
    };
  }, []);

  useEffect(() => {
    if (!sound && audio.current) { audio.current.pause(); setSpeaking(false); }
  }, [sound]);

  function play(name) {
    if (!recordings[name]) return;
    setChosen(name);
    setError('');
    const track = audio.current;
    track.pause();
    track.currentTime = 0;
    if (!sound) { setSpeaking(false); return; }
    track.src = recordingUrl(name);
    // A real child tap starts playback, including on Safari iOS.
    const promise = track.play();
    if (promise && typeof promise.then === 'function') {
      promise.then(() => setSpeaking(true)).catch(failure => {
        if (failure.name !== 'AbortError') setError('Înregistrarea nu este disponibilă. Verifică fișierele audio.');
        setSpeaking(false);
      });
    }
  }
  function navigate(action) {
    audio.current?.pause();
    action();
  }

  return <main className="vocab-page">
    <audio ref={audio} preload="none"
      onEnded={() => setSpeaking(false)} onPause={() => setSpeaking(false)}
      onError={() => { setSpeaking(false); setError('Înregistrarea nu este disponibilă. Verifică fișierele audio.'); }}/>
    <div className="vocab-heading">
      <div className="eyebrow">DESCOPERIM CUVINTE</div>
      <h1>Atinge și ascultă!</h1>
      <button type="button" className="vocab-intro-audio" onClick={() => play('instructiune')}>
        🔊 Ascultă instrucțiunea
      </button>
      <p>Atinge o imagine. Ascultă cuvântul. Repetă.</p>
    </div>
    <section className="vocab-feature" aria-label="Părțile mărului">
      <div className="vocab-apple-picture">
        <img src={imagePath('apple')} alt="Măr roșu cu codiță și frunză" draggable="false"/>
        <button type="button" className={'vocab-hotspot vocab-stem-hotspot' + (chosen === 'codita' ? ' vocab-hotspot-active' : '')}
          onClick={() => play('codita')} aria-label="Ascultă: Codiță"
          aria-pressed={chosen === 'codita'}>
          <span className="vocab-pin" aria-hidden="true">✦</span>
          <span className="vocab-hotspot-label">Codița ♪</span>
        </button>
        <button type="button" className={'vocab-hotspot vocab-leaf-hotspot' + (chosen === 'frunza' ? ' vocab-hotspot-active' : '')}
          onClick={() => play('frunza')} aria-label="Ascultă: Frunza"
          aria-pressed={chosen === 'frunza'}>
          <span className="vocab-hotspot-label">Frunza ♪</span>
        </button>
        <button type="button" className={'vocab-hotspot vocab-fruit-hotspot' + (chosen === 'mar' ? ' vocab-hotspot-active' : '')}
          onClick={() => play('mar')} aria-label="Ascultă: Măr"
          aria-pressed={chosen === 'mar'}>
          <span className="vocab-hotspot-label">Mărul ♪</span>
        </button>
      </div>
      <div className="vocab-feedback" aria-live="polite">
        <span className="vocab-feedback-symbol" aria-hidden="true">✦</span>
        <h2>{item ? item.text : 'Unde este codița?'}</h2>
        <p>{item ? (['intrebare', 'altele', 'instructiune'].includes(chosen) ? 'Ascultă și descoperă!' : 'Privește imaginea și repetă.') : 'Atinge mărul, codița sau frunza.'}</p>
        {chosen && <button type="button" className="vocab-repeat"
          onClick={() => play(chosen)}>↻ Mai ascultă o dată</button>}
        {error && <p className="vocab-audio-error" role="alert">{error}</p>}
        {!sound && <p className="vocab-muted">Pornește sunetul din partea de sus.</p>}
        {speaking && <span className="vocab-speaking" aria-hidden="true">♪ Se aude vocea Antoniei</span>}
      </div>
    </section>
    <section className="vocab-section" aria-labelledby="vocab-colors">
      <SpokenHeading id="vocab-colors" title="Ce culoare are mărul?" recording="intrebare" play={play}/>
      <div className="vocab-word-grid vocab-three-colors">{['rosu', 'verde', 'galben'].map(word =>
        <WordPicture key={word} word={word} active={chosen === word} play={play}/>)}</div>
    </section>
    <section className="vocab-section" aria-labelledby="vocab-others">
      <SpokenHeading id="vocab-others" title="Alte cuvinte din poezie" recording="altele" play={play}/>
      <div className="vocab-word-grid vocab-one-word">
        <WordPicture word="minge" active={chosen === 'minge'} play={play}/>
      </div>
    </section>
    <nav className="vocab-navigation" aria-label="Navigare">
      <button type="button" className="button light" onClick={() => navigate(onHome)}>⌂ Acasă</button>
      <button type="button" className="button primary" onClick={() => navigate(onListen)}>▶ Ascultă poezia</button>
      <button type="button" className="button secondary" onClick={() => navigate(onPlay)}>✦ Joacă-te</button>
    </nav>
  </main>;
}
