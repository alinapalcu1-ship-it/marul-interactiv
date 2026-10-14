import { scenes } from '../data/scenes';
export default function ProgressDots({ current, onSelect, interactive }) {
  return <nav className="progress" aria-label="Versurile poeziei">{scenes.map((scene, index) => {
    const dot = <span className={index === current ? 'selected' : index < current ? 'visited' : ''}/>;
    return interactive
      ? <button key={scene.text} aria-label={'Versul ' + (index + 1) + ': ' + scene.text} aria-current={index === current ? 'step' : undefined} onClick={() => onSelect(index)}>{dot}</button>
      : <span className="progress-mark" key={scene.text} aria-hidden="true">{dot}</span>;
  })}</nav>;
}
