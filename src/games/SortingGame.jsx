import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { canSort, closeToSlot, largerBasket, sortingApples } from './logic';

const colorNames = { red: 'roșu', yellow: 'galben' };
const gameAsset = name => import.meta.env.BASE_URL + 'assets/game/' + name + '.png';
const appleImage = color => gameAsset('apple-' + color + '-realistic');

export default function SortingGame({ reward, speak }) {
  const [apples] = useState(() => sortingApples());
  const [placed, setPlaced] = useState([]);
  const [selected, setSelected] = useState(null);
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState('Atinge un măr, apoi coșul de aceeași culoare!');
  const baskets = useRef({});
  const dragged = useRef(false);
  const reduce = useReducedMotion();
  const sorted = placed.length === apples.length;

  function sort(id, basket) {
    const apple = apples.find(item => item.id === id);
    if (canSort(apple, basket, placed)) {
      setPlaced(previous => previous.includes(id) ? previous : [...previous, id]);
      setSelected(null); setHint('Foarte bine! Alege alt măr.'); reward();
      if (placed.length === apples.length - 1) speak('question-more-apples', true);
    } else if (apple && !placed.includes(id)) setHint('Mai încearcă! Caută aceeași culoare.');
  }
  function chooseBasket(color) {
    if (won) return;
    if (!sorted) {
      if (selected) sort(selected, color);
      else setHint('Atinge mai întâi un măr!');
    } else if (color === largerBasket(apples)) {
      setWon(true); setHint('Bravo! Aici sunt mai multe mere!'); reward('bravo');
    } else setHint('Mai încearcă! Privește ambele coșuri.');
  }

  return <>
    <div className="sorting-instruction"><h2 className="sorting-question">{won ? 'Bravo!' : sorted ? 'În ce coș sunt mai multe mere?' : 'Pune fiecare măr în coșul cu aceeași culoare.'}</h2>{!won && <button className="pill repeat-instruction" aria-label="Ascultă din nou" onClick={() => speak(sorted ? 'question-more-apples' : 'instruction-sort-apples')}>🔊<span> Ascultă din nou</span></button>}</div>
    <div className={'sorting-area ' + (sorted ? 'all-sorted' : '')}>
      {!sorted && <div className="sorting-orchard" aria-label="Mere de sortat">{apples.map(apple =>
        <div className="sorting-apple-space" key={apple.id}>
          {!placed.includes(apple.id) && <motion.button className={'sorting-apple ' + (selected === apple.id ? 'selected-apple' : '')}
            aria-label={`Alege un măr ${colorNames[apple.color]}`} aria-pressed={selected === apple.id}
            drag dragSnapToOrigin dragMomentum={false} whileDrag={{ zIndex: 20, scale: reduce ? 1 : 1.05 }}
            onPointerDown={() => { dragged.current = false; }}
            onDragStart={() => { dragged.current = true; setSelected(apple.id); }}
            onDragEnd={(_, info) => {
              const color = ['red', 'yellow'].find(name => closeToSlot(info.point, baskets.current[name].getBoundingClientRect()));
              if (color) sort(apple.id, color);
            }}
            onClick={() => { if (!dragged.current) { setSelected(apple.id); setHint('Acum atinge coșul de aceeași culoare!'); } }}>
            <img src={appleImage(apple.color)} alt="" draggable="false"/>
          </motion.button>}
        </div>)}</div>}
      <div className="sorting-baskets">{['red', 'yellow'].map(color => <motion.button
        ref={element => baskets.current[color] = element} key={color}
        className={'sorting-basket basket-' + color + (won && color === 'red' ? ' basket-winner' : '')}
        aria-label={`Coșul ${colorNames[color]}`} onClick={() => chooseBasket(color)}
        animate={won && color === 'red' && !reduce ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ duration: 1.2 }}>
        <img className="basket-image" src={gameAsset('basket-' + color)} alt="" draggable="false"/>
        <span className="basket-apples">{apples.filter(apple => apple.color === color && placed.includes(apple.id)).map(apple =>
          <motion.img key={apple.id} src={appleImage(color)} alt={`Măr ${colorNames[color]} în coș`} draggable="false"
            initial={reduce ? false : { scale: .85 }} animate={{ scale: 1 }} transition={{ duration: .45 }}/>)}</span>
        <img className="basket-rim" src={gameAsset('basket-' + color)} alt="" draggable="false" aria-hidden="true"/>
      </motion.button>)}</div>
      {won && <div className="gentle-confetti" aria-hidden="true">{Array.from({ length: reduce ? 6 : 24 }, (_, index) =>
        <motion.i key={index} style={{ left: `${8 + (index % 12) * 7.5}%`, borderRadius: index % 3 === 0 ? '50%' : '3px', clipPath: index % 3 === 1 ? 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' : undefined, background: ['#c4d7a0', '#efd587', '#e6b5a1'][index % 3] }}
          initial={{ y: 0, opacity: 0, rotate: 0 }} animate={reduce ? { opacity: 1 } : { y: [0, 75, 150], opacity: [0, 1, 0], rotate: index % 2 ? 70 : -70 }}
          transition={{ duration: 2.2, delay: Math.floor(index / 12) * .6 + (index % 12) * .02 }}/>)}</div>}
    </div>
    <p className="game-feedback" role="status">{sorted && !won && !hint.startsWith('Mai încearcă') ? 'Privește și alege un coș!' : hint}</p>
  </>;
}

