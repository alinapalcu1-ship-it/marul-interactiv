import { useEffect, useState } from 'react';
import { duration, scenes, sceneAt } from '../data/scenes';
import SceneArtwork from './SceneArtwork';
import ControlBar from './ControlBar';
import ProgressDots from './ProgressDots';

export default function ScenePlayer({ audio, notice, setNotice, onHome, onPlay }) {
  const [time, setTime] = useState(audio.current.currentTime);
  const [playing, setPlaying] = useState(!audio.current.paused);
  const [ended, setEnded] = useState(false);
  const current = sceneAt(time);

  useEffect(() => {
    const media = audio.current;
    let frame;
    const sync = () => { setTime(media.currentTime); frame = requestAnimationFrame(sync); };
    const update = () => { setPlaying(!media.paused && !media.ended); setTime(media.currentTime); };
    const finish = () => { setEnded(true); setPlaying(false); setTime(duration); };
    const error = () => { setPlaying(false); setNotice('Înregistrarea nu poate fi încărcată. Apasă Reia pentru a încerca din nou.'); };
    // RAF only reads the media clock. It never accumulates elapsed wall time.
    frame = requestAnimationFrame(sync);
    media.addEventListener('play', update);
    media.addEventListener('pause', update);
    media.addEventListener('ended', finish);
    media.addEventListener('error', error);
    if (media.error) error();
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener('play', update);
      media.removeEventListener('pause', update);
      media.removeEventListener('ended', finish);
      media.removeEventListener('error', error);
      media.pause();
    };
  }, [audio, setNotice]);

  function play() {
    setNotice('');
    audio.current.play().catch(error => {
      if (error.name !== 'AbortError') setNotice('Apasă Redă pentru a asculta. Verifică dacă sunetul este disponibil.');
    });
  }
  function seek(value) {
    setEnded(false); setNotice('');
    if (audio.current.error) audio.current.load();
    audio.current.currentTime = value; setTime(value); play();
  }
  function toggle() {
    if (playing) { audio.current.pause(); setTime(audio.current.currentTime); }
    else if (ended) seek(0);
    else play();
  }
  return <main className="listen">
    <div className="verse-heading">
      <h1 className="verse">{ended ? 'Bravo!' : current < 0 ? 'Mărul' : scenes[current].text}</h1>
      {current >= 0 && <span className="scene-count" aria-label={'Scena ' + (current + 1) + ' din ' + scenes.length}>{current + 1}/{scenes.length}</span>}
    </div>
    <SceneArtwork current={current} time={time} ended={ended}/>
    <div className="player-bottom">
      {current >= 0 && <ProgressDots current={current} onSelect={index => seek(scenes[index].start)} interactive={!playing}/>}
      <ControlBar playing={playing} ended={ended} onToggle={toggle} onReplay={() => seek(0)} onHome={onHome} onPlay={onPlay}/>
      {notice && <p className="audio-note" role="status">{notice}</p>}
    </div>
  </main>;
}
