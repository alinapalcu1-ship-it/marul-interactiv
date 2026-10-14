export default function ControlBar({ playing, ended, onToggle, onReplay, onHome, onPlay }) {
  return <div className="controls">
    {ended ? <><button className="button primary" onClick={onReplay}>↻ Mai ascult o dată</button><button className="button secondary" onClick={onPlay}>✦ Joacă-te</button></>
      : <><button className="button primary" onClick={onToggle}>{playing ? 'Ⅱ Pauză' : '▶ Redă'}</button>
        {!playing && <><button className="button light" onClick={onReplay}>↻ Reia</button><button className="button secondary" onClick={onPlay}>✦ Joacă-te</button></>}</>}
    <button className="button light" onClick={onHome}>⌂ Acasă</button>
  </div>;
}
