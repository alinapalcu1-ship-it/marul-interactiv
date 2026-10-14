import ObjectToy from './ObjectToy';
import { useEffect, useRef, useState } from 'react';
import './home-intro.css';

export default function HomeScreen({ sound, onListen, onPlay, onVocab }) {
  const introduction = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  function stopIntroduction() {
    introduction.current.pause();
    introduction.current.currentTime = 0;
    setPlaying(false);
  }
  useEffect(() => {
    const track = introduction.current;
    return () => { track.pause(); track.currentTime = 0; };
  }, []);
  useEffect(() => { if (!sound) stopIntroduction(); }, [sound]);
  function playIntroduction() {
    introduction.current.pause();
    setError('');
    // Only play after a tap; replace this MP3 to change the welcome recording.
    introduction.current.currentTime = 0;
    introduction.current.play().catch(error => {
      if (error.name !== 'AbortError') setError('Prezentarea nu a pornit. Încearcă din nou.');
    });
  }
  function leave(action) { stopIntroduction(); action(); }
  return <main className="home">
    <audio ref={introduction} src={import.meta.env.BASE_URL + 'assets/audio/home-intro.mp3'} preload="metadata"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}/>
    <div className="eyebrow"><span /> MICI DESCOPERIRI, MARI BUCURII</div>
    <h1>Mărul</h1>
    <p className="intro">Ascultăm, descoperim culorile și ne jucăm împreună.</p>
    <div className="garden">
      <span className="sun" aria-hidden="true">☀</span><span className="cloud" aria-hidden="true"/>
      <span className="hello">Bună! Eu sunt Mărul! <span>♡</span></span>
      <div className="friends"><ObjectToy wave={playing} name="girl" className="child"/><ObjectToy wave={playing} name="apple" auto className="main-apple"/><ObjectToy wave={playing} name="boy" className="child"/></div>
      <span className="flower flower-one" aria-hidden="true">✿</span><span className="flower flower-two" aria-hidden="true">✿</span>
    </div>
    <div className="home-actions"><button className="button primary" onClick={() => leave(onListen)}><span>▶</span> Ascultă poezia</button><button className="button secondary" onClick={() => leave(onPlay)}><span>✦</span> Joacă-te</button><button className="button light" onClick={() => leave(onVocab)}><span>♫</span> Atinge și ascultă</button></div>
    <button className="pill home-intro-button" disabled={!sound} aria-pressed={playing} onClick={playIntroduction}>
      🔊 Ascultă prezentarea
    </button>
    <p className="small-note" role="status">{error || (!sound ? 'Pornește sunetul pentru a asculta prezentarea.' : 'O poezie de ascultat. O mulțime de descoperit.')}</p>
  </main>;
}



