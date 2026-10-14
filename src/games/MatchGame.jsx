import { useState } from 'react';
import { matchingRound, names } from './logic';
import { Character, Levels, Star } from './Shared';

export default function MatchGame({ reward }) {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [hint, setHint] = useState('Atinge la fel!');
  const { target, choices } = matchingRound(level, round);
  function choose(name) {
    if (correct) return;
    if (name === target) { setCorrect(true); setHint('Bravo! Ai găsit perechea!'); reward(); }
    else setHint('Privește modelul. Mai încearcă!');
  }
  function next() { setRound(value => value + 1); setCorrect(false); setHint('Atinge la fel!'); }
  return <>
    <Levels level={level} onChange={value => { setLevel(value); setRound(0); setCorrect(false); setHint('Atinge la fel!'); }}/>
    <div className="match-area">
      <div className="match-model"><Character name={target} celebrate={correct}/><span aria-hidden="true" className="match-arrow">↓</span><Star show={correct}/></div>
      <div className="match-choices" style={{ '--choices': choices.length }}>{choices.map(name =>
        <button key={`${round}-${name}`} className={'character-choice ' + (correct && name === target ? 'matched' : '')}
          aria-label={`Alege ${names[name]}`} onClick={() => choose(name)}>
          <Character name={name} celebrate={correct && name === target}/>
        </button>)}</div>
    </div>
    <div className="game-feedback" role="status"><span>{hint}</span>{correct && <button className="button primary" onClick={next}>{round % 3 === 2 ? 'Încă o dată' : 'Mai departe'} →</button>}</div>
  </>;
}
