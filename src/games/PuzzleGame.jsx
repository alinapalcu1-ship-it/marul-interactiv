import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { imagePath } from '../data/scenes';
import { characters, closeToSlot, names, shuffle, sliceBackgroundStyle } from './logic';
import { Character, Levels } from './Shared';

export default function PuzzleGame({ reward }) {
  const [character, setCharacter] = useState('apple');
  const [level, setLevel] = useState(1);
  const [placed, setPlaced] = useState([]);
  const [selected, setSelected] = useState(null);
  const [order, setOrder] = useState([1, 0]);
  const [hint, setHint] = useState('Atinge o piesă, apoi locul ei!');
  const slots = useRef([]);
  const dragged = useRef(false);
  const reduce = useReducedMotion();
  const count = level + 1;
  const complete = placed.length === count;
  function reset(name = character, value = level) {
    setCharacter(name); setLevel(value); setPlaced([]); setSelected(null);
    setOrder(shuffle(Array.from({ length: value + 1 }, (_, i) => i)));
    setHint('Atinge o piesă, apoi locul ei!');
  }
  function place(piece, slot) {
    if (piece == null || placed.includes(piece)) return;
    if (piece !== slot) { setHint('Mai încearcă. Privește conturul!'); return; }
    setPlaced(previous => previous.includes(piece) ? previous : [...previous, piece]);
    setSelected(null); setHint('Foarte bine!'); reward();
  }
  const slice = piece => <span className="puzzle-slice-image" aria-hidden="true" style={sliceBackgroundStyle(piece, count, imagePath(character))}/>;
  return <>
    <div className="puzzle-options"><Levels level={level} puzzle onChange={value => reset(character, value)}/>
      <div className="puzzle-characters" aria-label="Alege personajul">{characters.map(name =>
        <button key={name} aria-label={`Puzzle: ${names[name]}`} aria-pressed={character === name} onClick={() => reset(name)}><Character name={name}/></button>)}</div>
    </div>
    <div className={'puzzle-area ' + (count === 3 ? 'puzzle-horizontal' : '')} style={{ '--pieces': count }}>
      <div className="puzzle-board" aria-label="Imaginea de completat">
        <img className="puzzle-guide" src={imagePath(character)} alt=""/>
        {complete ? <div className="completed-puzzle"><Character name={character} celebrate/></div>
          : Array.from({ length: count }, (_, piece) => <button key={piece} ref={element => slots.current[piece] = element}
            className={'puzzle-slot ' + (placed.includes(piece) ? 'filled' : '')}
            aria-label={`Locul ${piece + 1}${placed.includes(piece) ? ': completat' : ''}`}
            onClick={() => place(selected, piece)}>
            {placed.includes(piece) ? slice(piece) : <span className="slot-dot" aria-hidden="true">{selected === piece ? '●' : '○'}</span>}
          </button>)}
      </div>
      <div className="puzzle-tray" aria-label="Piesele puzzle-ului">{order.map(piece => <div className="piece-space" key={piece}>
        {!placed.includes(piece) && <motion.button className={'puzzle-piece ' + (selected === piece ? 'chosen' : '')}
          aria-label={`Piesa ${piece + 1}`} aria-pressed={selected === piece}
          drag dragSnapToOrigin dragMomentum={false} whileDrag={{ zIndex: 10, scale: reduce ? 1 : 1.03 }}
          onDragStart={() => { dragged.current = true; setSelected(piece); }}
          onDragEnd={(_, info) => {
            const target = slots.current[piece];
            if (target && closeToSlot(info.point, target.getBoundingClientRect())) place(piece, piece);
          }}
          onPointerDown={() => { dragged.current = false; }}
          onClick={() => { if (!dragged.current) { setSelected(piece); setHint('Acum atinge locul piesei!'); } }}>
          {slice(piece)}
        </motion.button>}
      </div>)}</div>
    </div>
    <div className="game-feedback" role="status"><span>{complete ? 'Bravo! Ai reușit!' : hint}</span><button className="button secondary" onClick={() => reset(characters[(characters.indexOf(character) + 1) % 3])}>Alt puzzle</button></div>
  </>;
}
