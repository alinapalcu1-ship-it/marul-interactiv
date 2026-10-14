import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { labels } from '../data/scenes';
import './character-sprite.css';

export const characterPath = (name, pose = 'neutral') =>
  import.meta.env.BASE_URL + 'assets/characters/' + name + '-' + pose + '.png';
let preload;
function preloadCharacters() {
  // Keep all six original images decoded before switching poses.
  return preload ||= Promise.all(['apple', 'girl', 'boy'].flatMap(name => ['neutral', 'wave'].map(pose => {
    const image = new Image(); image.src = characterPath(name, pose);
    return image.decode().catch(() => {});
  })));
}
export default function CharacterSprite({ name, wave = false, blend, className = '', style, animate, transition }) {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => { let mounted = true; preloadCharacters().then(() => { if (mounted) setReady(true); }); return () => { mounted = false; }; }, []);
  const amount = ready ? (blend ?? (wave ? 1 : 0)) : 0;
  return <motion.span className={'character-sprite ' + className} role="img" aria-label={labels[name]} style={style} animate={animate} transition={transition}>
    <motion.img src={characterPath(name)} alt="" draggable="false" initial={false} animate={{ opacity: 1 - amount }} transition={{ duration: blend !== undefined || reduced ? 0 : .65 }}/>
    <motion.img src={characterPath(name, 'wave')} alt="" draggable="false" initial={false} animate={{ opacity: amount }} transition={{ duration: blend !== undefined || reduced ? 0 : .65 }}/>
  </motion.span>;
}
