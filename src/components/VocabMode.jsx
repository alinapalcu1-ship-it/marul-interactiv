import { useEffect, useRef, useState } from 'react';
import { imagePath } from '../data/scenes';
import './vocabulary.css';

// We reuse Antonia's original audio, without synthetic speech or new recordings.
// Some files contain a whole poetic phrase rather than an isolated noun.
const words = {
  apple: { label: 'Mărul', spoken: 'Mărul', audio: '00_titlu_marul.mp3', image: 'apple' },
  stem: { label: 'Codița', spoken: 'Și codiță mică are.', audio: '07_si_codita_mica_are.mp3', image: 'stem' },
  red: { label: 'Roșu', spoken: 'Roșu', audio: '02_rosu.mp3', image: 'red' },
  green: { label: 'Verde', spoken: 'Verde', audio: '03_verde.mp3', image: 'green' },
  yellow: { label: 'Gălbior', spoken: 'Gălbior', audio: '04_galbior.mp3', image: 'yellow' },
  ball: { label: 'Mingea', spoken: 'Parcă-i minge.', audio: '05_parca_i_minge.mp3', image: 'ball' },
  scent: { label: 'Parfumat', spoken: 'Parfumat', audio: '08_parfumat.mp3', image: 'scent' },
  healthy: { label: 'Sănătos', spoken: 'El mă face sănătos!', audio: '10_el_ma_face_sanatos.mp3', image: 'heart' },
};

function PictureWord({ word, active, onChoose }) {
  const item = words[word];
  return <button
    className={'vocab-picture-word' + (active ? ' vocab-chosen' : '')}
    type="button" onClick={() => onChoose(word)}
    aria-label={'Ascultă: ' + item.label} aria-pressed={active}>
    <img src={imagePath(item.image)} alt="" draggable="false" />
    <span className="vocab-picture-label">{item.label} <span aria-hidden="true">♪</span></span>
  </button>;
}

export default function VocabMode({ sound, onHome, onListen, onPlay }) {
  const audio = useRef(null);
  const [chosen, setChosen] = useState(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const track = audio.current;
    const onHidden = () => { if (document.hidden) track.pause(); };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      track.pause();
      track.currentTime = 0;
    };
  }, []);
  useEffect(() => { if (!sound) { audio.current?.pause(); setIsPlaying(false); } }, [sound]);

  function choose(name) {
    const word = words[name];
    setChosen(name);
    setError('');
    const track = audio.current;
    track.pause();
    track.currentTime = 0;
    if (!sound) { setIsPlaying(false); return; }
    // Run play() from the child's tap; mobile Safari requires a user gesture.
    track.src = import.meta.env.BASE_URL + 'assets/audio/' + word.audio;
    track.play().then(() => setIsPlaying(true)).catch(err => {
      if (err.name !== 'AbortError') setError('Sunetul nu a pornit. Atinge din nou imaginea.');
      setIsPlaying(false);
    });
  }
  const current = chosen && words[chosen];
  const stopAndGo = destination => {
    audio.current?.pause();
    audio.current.currentTime = 0;
    destination();
  };

  return <main className="vocab-page">
    <audio ref={audio} preload="none" onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />
    <div className="vocab-heading">
      <div className="eyebrow">DESCOPERIM CUVINTE</div>
      <h1>Atinge și ascultă!</h1>
      <p>Atinge o imagine. Ascultă cuvântul. Mai încearcă ori de câte ori dorești!</p>
    </div>
    <section className="vocab-feature" aria-label="Descoperă mărul și codița">
      <div className="vocab-apple-picture">
        <img src={imagePath('apple')} alt="Măr roșu vesel cu codiță și frunză" draggable="false" />
        <button type="button" className={'vocab-hotspot vocab-stem-hotspot' + (chosen === 'stem' ? ' vocab-hotspot-active' : '')}
          onClick={() => choose('stem')} aria-label="Atinge codița mărului"
          aria-pressed={chosen === 'stem'}>
          <span className="vocab-pin" aria-hidden="true">✦</span>
          <span className="vocab-hotspot-label">Codița ♪</span>
        </button>
        <button type="button" className={'vocab-hotspot vocab-fruit-hotspot' + (chosen === 'apple' ? ' vocab-hotspot-active' : '')}
          onClick={() => choose('apple')} aria-label="Atinge mărul"
          aria-pressed={chosen === 'apple'}>
          <span className="vocab-hotspot-label">Mărul ♪</span>
        </button>
      </div>
      <div className="vocab-feedback" aria-live="polite">
        <span className="vocab-feedback-symbol" aria-hidden="true">✦</span>
        <h2>{current ? current.label : 'Unde este codița?'}</h2>
        <p>{current
          ? current.spoken
          : 'Atinge codița sau mărul. Ascultă vocea Antoniei.'}</p>
        {current && <button type="button" className="vocab-repeat" onClick={() => choose(chosen)}
          aria-label={'Ascultă din nou: ' + current.label}>↻ Mai ascultă o dată</button>}
        {error && <p className="vocab-audio-error" role="alert">{error}</p>}
        {!sound && <p className="vocab-muted">Pornește sunetul din partea de sus pentru a asculta.</p>}
        {isPlaying && <span className="vocab-speaking" aria-hidden="true">♪ Se aude cuvântul</span>}
      </div>
    </section>
    <section className="vocab-section" aria-labelledby="vocab-colors">
      <h2 id="vocab-colors">Ce culoare are mărul?</h2>
      <p>Atinge merele, pe rând.</p>
      <div className="vocab-word-grid">{['red', 'green', 'yellow'].map(key =>
        <PictureWord key={key} word={key} active={chosen === key} onChoose={choose} />)}</div>
    </section>
    <section className="vocab-section" aria-labelledby="vocab-others">
      <h2 id="vocab-others">Alte cuvinte din poezie</h2>
      <p>Atinge și descoperă.</p>
      <div className="vocab-word-grid">{['ball', 'scent', 'healthy'].map(key =>
        <PictureWord key={key} word={key} active={chosen === key} onChoose={choose} />)}</div>
    </section>
    <nav className="vocab-navigation" aria-label="Navigare">
      <button type="button" className="button light" onClick={() => stopAndGo(onHome)}>⌂ Acasă</button>
      <button type="button" className="button primary" onClick={() => stopAndGo(onListen)}>▶ Ascultă poezia</button>
      <button type="button" className="button secondary" onClick={() => stopAndGo(onPlay)}>✦ Joacă-te</button>
    </nav>
  </main>;
}
