import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { imagePath } from '../data/scenes';
import { characters, matchingCards, memoryDeck, names } from './logic';
import { Character, Levels } from './Shared';

export default function MemoryGame({ reward }) {
  const [level, setLevel] = useState(1);
  const [deck, setDeck] = useState(() => memoryDeck(1));
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const timer = useRef(null);
  const reduce = useReducedMotion();
  const complete = matched.length === deck.length;
  useEffect(() => () => clearTimeout(timer.current), []);
  function reset(value) {
    clearTimeout(timer.current); setLevel(value); setDeck(memoryDeck(value)); setOpen([]); setMatched([]);
  }
  function flip(index) {
    if (open.length === 2 || open.includes(index) || matched.includes(index)) return;
    const next = [...open, index]; setOpen(next);
    if (next.length !== 2) return;
    if (matchingCards(deck, next[0], next[1])) {
      setMatched(previous => [...previous, ...next]); setOpen([]); reward();
    } else {
      // Two full seconds to observe the pair before the gentle return animation.
      timer.current = setTimeout(() => setOpen([]), 2000);
    }
  }
  return <>
    <Levels level={level} onChange={reset}/>
    {complete ? <div className="memory-celebration"><h2>Bravo!</h2><div>{characters.slice(0, level === 1 ? 2 : 3).map(name => <Character name={name} key={name} celebrate/>)}</div><button className="button primary" onClick={() => reset(level)}>Încă o dată</button></div>
      : <div className="memory-stage"><div className={'memory-grid memory-level-' + level}>{deck.map((card, index) => {
        const visible = open.includes(index) || matched.includes(index);
        return <button className={'memory-card ' + (matched.includes(index) ? 'found' : '')} key={card.id}
          aria-label={`Cartonaș ${index + 1}${visible ? ': ' + names[card.name] : ': ascuns'}`}
          aria-disabled={visible || open.length === 2} onClick={() => flip(index)}>
          <motion.span className="memory-inner" animate={{ rotateY: visible ? 180 : 0 }} transition={{ duration: reduce ? 0 : .55, ease: 'easeInOut' }}>
            <span className="memory-back" aria-hidden="true"><img src={imagePath('apple')} alt=""/><span>?</span></span>
            <span className="memory-front" aria-hidden={!visible}><Character name={card.name}/></span>
          </motion.span>
        </button>;
      })}</div></div>}
    {!complete && <p className="game-feedback" role="status">{open.length === 2 ? 'Privește. Încercăm din nou!' : 'Atinge două cartonașe!'}</p>}
  </>;
}
