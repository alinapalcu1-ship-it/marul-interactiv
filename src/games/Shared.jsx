import { useReducedMotion } from 'framer-motion';
import CharacterSprite from '../components/CharacterSprite';
import { imagePath } from '../data/scenes';
import { names } from './logic';

export function Character({ name, celebrate = false }) {
  const reduce = useReducedMotion();
  return <CharacterSprite className="game-character" name={name} wave={celebrate}
    animate={celebrate && !reduce ? { scale: [1, 1.07, 1], rotate: [0, -3, 3, 0] } : { scale: 1, rotate: 0 }}
    transition={{ duration: 1.1, ease: 'easeInOut' }}/>;
}

export function Levels({ level, onChange, puzzle = false }) {
  return <div className="game-levels" aria-label="Alege nivelul">{[1, 2].map(value =>
    <button key={value} aria-pressed={level === value} onClick={() => onChange(value)}>
      {puzzle ? `${value + 1} piese` : `Nivelul ${value}`}
    </button>)}</div>;
}

export function Star({ show }) {
  return <span className={'game-star ' + (show ? 'earned' : '')} aria-hidden="true">★</span>;
}

