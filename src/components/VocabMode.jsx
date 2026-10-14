import { useEffect, useState } from 'react';
import { imagePath } from '../data/scenes';
import './vocabulary.css';
import './vocabulary-pages.css';

const words = {
  mar: ['Măr', 'mar.mp3'],
  codita: ['Codiță', 'codita.mp3'],
  frunza: ['Frunza', 'frunza.mp3'],
  rosu: ['Măr roșu', 'mar-rosu.mp3'],
  verde: ['Măr verde', 'mar-verde.mp3'],
  galben: ['Măr galben', 'mar-galben.mp3'],
  minge: ['Minge', 'minge.mp3'],
  intrebare: ['Ce culoare are mărul?', 'intrebare-culoare.mp3'],
  altele: ['Alte cuvinte din poezie', 'alte-cuvinte.mp3'],
};
const colors = ['rosu', 'verde', 'galben'];
const pictures = ['red', 'green', 'yellow'];
const titles = ['Părțile mărului', 'Ce culoare are mărul?', 'Alte cuvinte din poezie'];

export default function VocabMode({ audio, sound, onHome, onListen, onPlay }) {
  const [section, setSection] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [chosen, setChosen] = useState('');
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const track = audio.current;
    const sync = () => setSpeaking(!track.paused && !track.ended);
    const hidden = () => { if (document.hidden) track.pause(); };
    track.addEventListener('play', sync);
    track.addEventListener('pause', sync);
    track.addEventListener('ended', sync);
    document.addEventListener('visibilitychange', hidden);
    sync();
    return () => {
      document.removeEventListener('visibilitychange', hidden);
      track.removeEventListener('play', sync);
      track.removeEventListener('pause', sync);
      track.removeEventListener('ended', sync);
      track.pause();
    };
  }, [audio]);
  useEffect(() => {
    if (!sound) audio.current?.pause();
  }, [sound, audio]);

  function say(name) {
    if (!words[name]) return;
    setChosen(name); setError('');
    const track = audio.current;
    track.pause();
    track.currentTime = 0;
    if (!sound) return;
    track.src = import.meta.env.BASE_URL + 'assets/vocabulary/' + words[name][1];
    track.play().catch(err => {
      if (err.name !== 'AbortError') setError('Sunetul nu a pornit. Atinge din nou imaginea.');
    });
  }
  function goSection(next) {
    setSection(next);
    setColorIndex(0);
    setChosen('');
    if (next === 1) say('intrebare');
    else if (next === 2) say('altele');
    else say('mar');
  }
  function goColor(index) {
    setColorIndex(index);
    say(colors[index]);
  }
  function leave(action) {
    audio.current.pause();
    action();
  }

  return <main className="vocab-page vocab-paged">
    <div className="vocab-paged-heading">
      <div className="eyebrow">ATINGE ȘI ASCULTĂ · {section + 1}/3</div>
      <h1>{titles[section]}</h1>
      {section !== 0 && <button type="button" className="vocab-heading-sound"
        onClick={() => say(section === 1 ? 'intrebare' : 'altele')}>
        <span aria-hidden="true">🔊</span> Reascultă
      </button>}
    </div>
    <section className="vocab-paged-stage" aria-label={titles[section]}>
      {section === 0 ? <div className="vocab-focus-apple">
        <img src={imagePath('apple')} alt="Mărul roșu cu codiță și frunză" draggable="false"/>
        <button className="vocab-tap-area vocab-tap-stem" type="button" onClick={() => say('codita')}
          aria-label="Ascultă: Codiță"><span>Codița ♪</span></button>
        <button className="vocab-tap-area vocab-tap-leaf" type="button" onClick={() => say('frunza')}
          aria-label="Ascultă: Frunza"><span>Frunza ♪</span></button>
        <button className="vocab-tap-area vocab-tap-fruit" type="button" onClick={() => say('mar')}
          aria-label="Ascultă: Măr"><span>Mărul ♪</span></button>
      </div> : section === 1 ? <div className="vocab-focus-color">
        <button className="vocab-color-arrow" type="button" disabled={colorIndex === 0}
          onClick={() => goColor(colorIndex - 1)} aria-label="Culoarea anterioară">‹</button>
        <button className="vocab-big-picture" type="button" onClick={() => say(colors[colorIndex])}
          aria-label={'Ascultă: ' + words[colors[colorIndex]][0]}>
          <img src={imagePath(pictures[colorIndex])} alt={words[colors[colorIndex]][0]} draggable="false"/>
          <span>{words[colors[colorIndex]][0]} ♪</span>
        </button>
        <button className="vocab-color-arrow" type="button" disabled={colorIndex === 2}
          onClick={() => goColor(colorIndex + 1)} aria-label="Culoarea următoare">›</button>
        <div className="vocab-color-dots" aria-label={'Culoarea ' + (colorIndex + 1) + ' din 3'}>
          {colors.map((color, index) => <button key={color} type="button" onClick={() => goColor(index)}
            aria-label={words[color][0]} aria-current={colorIndex === index ? 'step' : undefined}
            className={index === colorIndex ? 'active' : ''}/>)}
        </div>
      </div> : <button className="vocab-focus-ball" type="button" onClick={() => say('minge')}
        aria-label="Ascultă: Minge">
        <img src={imagePath('ball')} alt="Minge colorată" draggable="false"/>
        <span>Minge ♪</span>
      </button>}
    </section>
    <div className="vocab-paged-bottom">
      <div className="vocab-status" aria-live="polite">
        <span>{chosen && words[chosen] ? words[chosen][0] : section === 0 ? 'Atinge mărul, codița sau frunza' : 'Atinge imaginea și ascultă'}</span>
        {speaking && <span className="vocab-sound-wave" aria-label="Se redă înregistrarea">♫</span>}
        {error && <p role="alert">{error}</p>}
        {!sound && <p>Activează sunetul din partea de sus.</p>}
      </div>
      <nav className="vocab-step-navigation" aria-label="Secțiunile vocabularului">
        <button type="button" className="vocab-nav-secondary" onClick={() => section === 0 ? leave(onHome) : goSection(section - 1)}>
          ‹ {section === 0 ? 'Acasă' : 'Înapoi'}
        </button>
        <span className="vocab-step-count">{section + 1} / 3</span>
        <button type="button" className="vocab-nav-primary" onClick={() => goSection(section === 2 ? 0 : section + 1)}>
          {section === 2 ? 'De la început' : 'Mai departe'} ›
        </button>
      </nav>
    </div>
  </main>;
}
