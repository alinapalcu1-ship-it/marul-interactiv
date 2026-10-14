import { useEffect, useRef, useState } from 'react';
import CharacterSprite from './CharacterSprite';
import { motion, useReducedMotion } from 'framer-motion';
import { imagePath, labels } from '../data/scenes';
import { playClip } from '../audio';

export default function ObjectToy({ name, sound = false, className = '', wave = false }) {
  const [turn, setTurn] = useState(0);
  const reduce = useReducedMotion();
  const [greeting, setGreeting] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const animation = !turn || reduce ? {} : name === 'ball'
    ? { y: ['0%', '-18%', '0%', '-12%', '0%'] }
    : name === 'scent' ? { opacity: [.5, 1, .7, 1], y: ['0%', '-5%', '0%'] }
    : name === 'heart' ? { scale: [1, 1.07, 1, 1.05, 1] }
    : { rotate: [0, -5, 5, -3, 0] };
  return <button className={'toy ' + className} aria-label={labels[name]} onClick={() => {
    setTurn(value => value + 1);
    clearTimeout(timer.current); setGreeting(true);
    timer.current = setTimeout(() => setGreeting(false), 2200);
    playClip(name, sound);
  }}>
    {['apple', 'girl', 'boy'].includes(name) ? <CharacterSprite name={name} wave={wave || greeting}/> : <motion.img key={turn} src={imagePath(name)} alt={labels[name]} draggable="false"
      animate={animation} transition={{ duration: 1.8, ease: 'easeInOut' }} />}
  </button>;
}

