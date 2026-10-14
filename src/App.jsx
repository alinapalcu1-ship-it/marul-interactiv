import { useEffect, useRef, useState } from 'react';
import HomeScreen from './components/HomeScreen';
import ScenePlayer from './components/ScenePlayer';
import PlayMode from './components/PlayMode';
import { stopClip } from './audio';
import { audioPath, imagePath } from './data/scenes';

export default function App() {
  const audio = useRef(null);
  const [screen, setScreen] = useState('home');
  const [sound, setSound] = useState(true);
  const [notice, setNotice] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => { document.removeEventListener('fullscreenchange', update); stopClip(); };
  }, []);

  function navigate(next) {
    stopClip(); audio.current.pause(); audio.current.currentTime = 0;
    setNotice(''); setScreen(next);
    // Start inside the user's tap, before mounting the player (mobile Safari).
    if (next === 'listen') audio.current.play().catch(error => {
      if (error.name !== 'AbortError') setNotice('Apasă Redă pentru a asculta.');
    });
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setNotice('Ecranul complet nu este disponibil în acest browser.'); }
  }
  return <div className={'app screen-' + screen + (screen === 'listen' ? ' reciting' : '')}>
    <audio ref={audio} src={audioPath} muted={!sound} preload="auto"/>
    <header>
      <button className="brand" onClick={() => navigate('home')} aria-label="Mărul — Acasă">
        <img src={imagePath('apple')} alt=""/><span>Mărul<small>ÎNVĂȚĂM PRIN JOACĂ</small></span>
      </button>
      <div className="header-actions">
        {screen !== 'home' && <button className="pill home-link" onClick={() => navigate('home')}>⌂ Acasă</button>}
        <button className="pill sound-button" aria-pressed={sound} onClick={() => { stopClip(); setSound(value => !value); }}>♫ Sunet {sound ? 'pornit' : 'oprit'}</button>
        {document.fullscreenEnabled && <button className="pill fullscreen-button" aria-label={fullscreen ? 'Ieși din ecran complet' : 'Ecran complet'} onClick={toggleFullscreen}>⛶<span> {fullscreen ? 'Micșorează' : 'Ecran complet'}</span></button>}
      </div>
    </header>
    {screen === 'home' ? <HomeScreen sound={sound} onListen={() => navigate('listen')} onPlay={() => navigate('play')}/>
      : screen === 'listen' ? <ScenePlayer audio={audio} notice={notice} setNotice={setNotice} onHome={() => navigate('home')} onPlay={() => navigate('play')}/>
      : <PlayMode sound={sound} onListen={() => navigate('listen')} onHome={() => navigate('home')}/>}
    {screen !== 'listen' && <><p className="notice" role="status">{notice}</p><footer>♡ Cu bucurie, pentru cei mici <span>2–3 ani · Ascultă. Descoperă. Zâmbește.</span></footer></>}
  </div>;
}
