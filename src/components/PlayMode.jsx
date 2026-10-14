import { useState } from 'react';
import MatchGame from '../games/MatchGame';
import PuzzleGame from '../games/PuzzleGame';
import MemoryGame from '../games/MemoryGame';
import SortingGame from '../games/SortingGame';
import useGameAudio from '../games/useGameAudio';
import '../games/games.css';

const games = [
  { id: 'match', title: 'Găsește perechea!', icon: '▣ ▣', hint: 'Privește și potrivește', Component: MatchGame },
  { id: 'puzzle', title: 'Puzzle vesel', icon: '🧩', hint: 'Piesă cu piesă', Component: PuzzleGame },
  { id: 'memory', title: 'Cine se ascunde?', icon: '? ?', hint: 'Memory', Component: MemoryGame },
  { id: 'sorting', title: 'Surpriza merelor!', icon: '✦', hint: 'Joc surpriză · Culori și descoperiri', Component: SortingGame },
];

export default function PlayMode({ sound, onListen, onHome, onVocab }) {
  const [active, setActive] = useState(null);
  const [restart, setRestart] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { music, voice, speak, reward, stopVoice, resumeMusic, finishVoice } = useGameAudio(sound, musicEnabled);
  function leave(action) { stopVoice(); music.current.pause(); action(); }
  return <main className={'games ' + (active ? 'game-active' : 'game-menu')}>
    <audio ref={music} className="game-music" src={import.meta.env.BASE_URL + 'assets/audio/play-background-music.mp3'} loop preload="metadata"/>
    <audio ref={voice} className="game-voice" onEnded={finishVoice} onError={finishVoice}/>
    {active ? <>
      <h1 className="game-title">{active.title}</h1>
      <Activity key={active.id + restart} Component={active.Component} reward={reward} speak={speak}/>
      <nav className="game-navigation" aria-label="Comenzile jocului">
        <button className="button light" onClick={() => leave(onHome)}>⌂ Acasă</button>
        <button className="button light" onClick={() => { stopVoice(); setRestart(value => value + 1); if (active.id === 'sorting') speak('instruction-sort-apples'); }}>{active.id === 'sorting' ? '↻ Reia jocul' : '↻ Reia'}</button>
        <button className="button secondary" onClick={() => { stopVoice(); setActive(null); }}>← Alt joc</button>
      </nav>
    </> : <>
      <div><div className="eyebrow">DESCOPERIM ÎMPREUNĂ</div><h1>Hai să ne jucăm!</h1><p className="intro">Alege un joc!</p></div>
      <div className="game-options">{games.map(game => <button className={'game-option option-' + game.id} key={game.id} onClick={() => { resumeMusic(); setActive(game); if (game.id === 'sorting') speak('instruction-sort-apples'); }}>
        <span className="game-option-icon" aria-hidden="true">{game.icon}</span><span><strong>{game.title}</strong><small>{game.hint}</small></span><span className="game-option-arrow" aria-hidden="true">→</span>
      </button>)}</div>
      <div className="game-menu-footer"><button className="music-toggle" aria-pressed={musicEnabled} onClick={() => setMusicEnabled(value => !value)}>♫ Muzică {musicEnabled ? 'pornită' : 'oprită'}</button><button className="button light listen-link" onClick={() => leave(onListen)}>▶ Ascultă poezia</button><button className="button light" onClick={() => leave(onVocab)}>♫ Atinge și ascultă</button></div>
    </>}
  </main>;
}

function Activity({ Component, reward, speak }) {
  return <section className={'game-activity activity-' + (Component === SortingGame ? 'sorting' : 'standard')}><Component reward={reward} speak={speak}/></section>;
}
