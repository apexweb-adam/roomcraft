import React,{useEffect,useRef,useReducer,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {mountRoom} from './scene.js';
import {initialState,updateScene,exportScene,restoreScene,OBJECTS} from './state.js';
import './style.css';
const KEY='roomcraft-scene-v1';
const load=()=>{try{return restoreScene(JSON.parse(localStorage.getItem(KEY)));}catch{return initialState();}};
function Icon({name}){const paths={cube:<><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/></>,home:<><path d="m3 10 9-8 9 8v11h-7v-7h-4v7H3Z"/></>,full:<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>,left:<path d="m13 5-7 7 7 7M6 12h14"/>,right:<path d="m11 5 7 7-7 7M18 12H4"/>};return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;}
function Segments({label,options,value,onChange}){return <fieldset><legend>{label}</legend><div className="segments">{options.map(o=><button key={o} type="button" aria-pressed={o===value} onClick={()=>onChange(o)}>{o}</button>)}</div></fieldset>;}
function App(){
  const [state,dispatch]=useReducer(updateScene,undefined,load);
  const [status,setStatus]=useState('');const [ready,setReady]=useState(false);const [error,setError]=useState('');
  const host=useRef(null),scene=useRef(null),stage=useRef(null),file=useRef(null);
  useEffect(()=>{try{scene.current=mountRoom(host.current,value=>dispatch({type:'select',value}),()=>setReady(true));scene.current.update(state);}catch(e){setError('This browser could not start WebGL. Try a recent browser with hardware acceleration enabled.');console.error(e);}return()=>scene.current?.dispose();},[]);
  useEffect(()=>{scene.current?.update(state);try{localStorage.setItem(KEY,JSON.stringify(state));}catch{setStatus('Scene works, but this browser cannot save it locally.');}},[state]);
  const set=(type,value)=>dispatch({type,value});
  const reset=()=>{dispatch({type:'reset'});scene.current?.home();setStatus('Scene reset.');};
  const download=()=>{const blob=new Blob([JSON.stringify(exportScene(state),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='roomcraft-scene.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Scene exported as JSON.');};
  const full=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(stage.current.requestFullscreen)await stage.current.requestFullscreen();else setStatus('Use your browser’s full-screen control.');}catch{setStatus('Full-screen is unavailable in this browser.');}};
  const importFile=async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{if(f.size>65536)throw Error('File too large.');const data=JSON.parse(await f.text());if(data.format!=='roomcraft-scene'||data.version!==1)throw Error('Use a Roomcraft version 1 scene file.');const clean=restoreScene(data);dispatch({type:'reset'});set('layout',clean.layout);set('atmosphere',clean.atmosphere);set('finish',clean.finish);if(!clean.light)dispatch({type:'light'});for(const n of OBJECTS){set('select',n);set('move',clean.objects[n].x);set('rotate',clean.objects[n].rotation);}set('select',clean.selected);setStatus('Scene imported.');}catch(err){setStatus(`Import failed: ${err.message}`);}};
  return <div className="app">
    <header><a href="/" className="brand" aria-label="Roomcraft home"><Icon name="cube"/><span>Roomcraft</span></a><span className="tagline">A spatial interaction study</span><div className="header-actions"><button onClick={reset}>Reset scene</button><button className="primary" onClick={download}>Export scene</button></div></header>
    <section className="intro"><h1>A little room. Yours to change.</h1><p>Explore a space, move its objects, and see how light changes everything.</p></section>
    <main className="workspace">
      <section className={`stage ${state.atmosphere==='Night'?'night':''}`} ref={stage} aria-label="3D scene">
        <div className="stage-label">01 / THE {state.layout.toUpperCase()}</div><div className="view-actions"><button title="Reset camera view" aria-label="Reset camera view" onClick={()=>scene.current?.home()}><Icon name="home"/></button><button title="Toggle fullscreen" aria-label="Toggle fullscreen" onClick={full}><Icon name="full"/></button></div>
        <div className="webgl" ref={host}/>{!ready&&!error&&<p className="loading" role="status">Building your room…</p>}{error&&<p className="render-error" role="alert">{error}</p>}
        <p className="canvas-help">Drag to orbit <span>·</span> Scroll to zoom <span>·</span> Click an object</p>
      </section>
      <aside className="inspector" aria-label="Scene controls"><h2>Make it your space</h2>
        <div className="section"><Segments label="Layout" options={['Studio','Lounge']} value={state.layout} onChange={v=>set('layout',v)}/></div>
        <div className="section"><Segments label="Atmosphere" options={['Daylight','Golden hour','Night']} value={state.atmosphere} onChange={v=>set('atmosphere',v)}/></div>
        <fieldset className="section"><legend>Wall finish</legend><div className="swatches">{['Chalk','Sage','Clay'].map(c=><button key={c} aria-pressed={state.finish===c} aria-label={`${c} wall finish`} onClick={()=>set('finish',c)}><span className={`swatch ${c.toLowerCase()}`}/><span>{c}</span></button>)}</div></fieldset>
        <div className="section selection"><label htmlFor="selected">Selected object</label><select id="selected" value={state.selected} onChange={e=>set('select',e.target.value)}>{OBJECTS.map(n=><option key={n}>{n}</option>)}</select></div>
        <div className="section transforms"><label htmlFor="rotation">Rotation</label><div className="slider"><input id="rotation" aria-label="Object rotation" type="range" min="-180" max="180" step="15" value={state.objects[state.selected].rotation} onChange={e=>set('rotate',Number(e.target.value))}/><output htmlFor="rotation">{state.objects[state.selected].rotation}°</output></div><div className="move-actions"><button disabled={state.objects[state.selected].x<=-.7} onClick={()=>set('move',-.2)}><Icon name="left"/>Move left</button><button disabled={state.objects[state.selected].x>=.7} onClick={()=>set('move',.2)}><Icon name="right"/>Move right</button></div></div>
        <div className="lamp-row"><span id="lamp-label">Light on</span><button role="switch" aria-labelledby="lamp-label" aria-checked={state.light} className="switch" onClick={()=>dispatch({type:'light'})}><span/></button></div>
        <div className="inspector-bottom"><button className="text-button" onClick={()=>file.current.click()}>Import scene</button><input ref={file} className="file-input" type="file" accept=".json,application/json" onChange={importFile}/><span>Saved on this device</span></div>
      </aside>
    </main>
    <div className="feedback" role="status" aria-live="polite">{status}</div>
    <footer><span>Original 3D web study by Ádám Tokár <span className="dot">·</span> September 2026</span><span>Works entirely in your browser.</span></footer>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
