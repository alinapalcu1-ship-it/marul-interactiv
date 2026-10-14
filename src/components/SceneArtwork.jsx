import CharacterSprite from './CharacterSprite';
import { motion, useReducedMotion } from 'framer-motion';
import { colorTimes, imagePath, labels, scenes, tasteTime } from '../data/scenes';

const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const x = clamp(value); return x * x * (3 - 2 * x); };

// Pure poses, sampled from audio.currentTime. No free-running animation or CSS transition.
export function pose(name, elapsed, reduce = false) {
  if (reduce) return { rotate: 0, y: '0%', scale: 1 };
  const wave = Math.sin(Math.max(0, elapsed) * Math.PI / 1.4);
  if (name === 'ball') {
    const t = clamp(elapsed / 2.4);
    return { y: (-18 * Math.abs(Math.sin(t * Math.PI * 2))) + '%', rotate: 0, scale: 1 };
  }
  if (name === 'heart') return { scale: 1 + .035 * Math.sin(elapsed * Math.PI / 1.2), rotate: 0, y: '0%' };
  return { rotate: wave * (name === 'girl' || name === 'boy' ? 3 : 4), y: '0%', scale: 1 };
}

function Art({ name, elapsed, className = '', style = {}, greeting = false }) {
  const reduce = useReducedMotion();
  if (name === 'heart') return <motion.svg className={'recital-art ' + className} viewBox="0 0 100 100" role="img" aria-label="Sănătate" style={{ ...pose(name, elapsed, reduce), ...style }}>
    <path fill="#e6a49a" d="M50 87C39 77 8 58 8 33C8 8 39 4 50 25C61 4 92 8 92 33C92 58 61 77 50 87Z"/>
    <path d="M31 47L45 61L71 34" fill="none" stroke="#fffdf5" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </motion.svg>;
  if (['apple', 'red', 'girl', 'boy'].includes(name)) return <CharacterSprite name={name === 'red' ? 'apple' : name} className={'recital-art ' + className} blend={greeting ? ease(elapsed / 1.1) : 0} style={{ ...pose(name, elapsed, reduce), ...style }}/>;
  return <motion.img className={'recital-art ' + className} src={imagePath(name)}
    alt={labels[name]} draggable="false" style={{ ...pose(name, elapsed, reduce), ...style }}/>;
}

export default function SceneArtwork({ current, time, ended }) {
  const reduce = useReducedMotion();
  const elapsed = current < 0 ? time : time - scenes[current].start;
  const group = current < 0 || current === 6;
  return <div className={'recital-stage stage-' + current} data-scene={current < 0 ? 'titlu' : current + 1}>
    <div className="ground" aria-hidden="true"/>
    {group ? <div className="recital-friends">
      <Art greeting name="girl" elapsed={elapsed} className="friend-girl"/>
      <Art greeting name="apple" elapsed={elapsed} className="friend-apple"/>
      <Art greeting name="boy" elapsed={elapsed} className="friend-boy"/>
      {current === 6 && <Art name="heart" elapsed={elapsed} className="friend-heart"
        style={{ opacity: ended ? 1 : .4 + .6 * ease(elapsed / .8) }}/>}
    </div> : current === 1 ? <div className="recital-colors">
      {['red', 'green', 'yellow'].map((name, index) => {
        const age = time - colorTimes[index];
        return <div className={'color-slot color-' + name} key={name}>
          {age >= 0 && <Art name={name} elapsed={Math.min(age, 1.4)} style={{
            opacity: .35 + .65 * ease(age / .65),
            scale: reduce ? 1 : .94 + .06 * ease(age / .9),
          }}/>}
        </div>;
      })}
    </div> : <div className={'solo-art ' + (current === 4 ? 'stem-composition' : '')}
      style={current === 4 ? { transform: 'scale(' + (reduce ? 1 : 1 + .06 * ease(elapsed / 1.8)) + ')' } : undefined}>
      <Art name={current === 2 ? 'ball' : current === 0 ? 'apple' : 'red'} elapsed={elapsed}
        style={current === 4 ? { rotate: 0 } : current === 5 && time >= tasteTime
          ? { scale: 1 + (reduce ? 0 : .035 * Math.sin((time - tasteTime) * Math.PI / 2)), rotate: 0 } : {}}/>
      {current === 4 && <motion.span className="character-stem-highlight" aria-label="Codița cu frunză" role="img"
        style={{ opacity: .45 + .2 * Math.sin(elapsed * Math.PI / 1.5) }}/>}
      {current === 5 && <motion.img className="aroma" src={imagePath('scent')} alt="Parfum"
        style={{ opacity: .8 - .35 * ease((time - tasteTime) / .7), y: reduce ? '0%' : (-3 * Math.sin(elapsed * Math.PI / 2)) + '%' }}/>}
    </div>}
  </div>;
}



