import {useCallback,useEffect,useRef,useState} from 'react';
import {asset} from './site';

export type EffectName='click'|'load'|'riser'|'swipe'|'whoosh';
const levels={click:.1,load:1,riser:.1,swipe:.2,whoosh:.1};
const backgrounds={grid:.85,other:.3,project:.2};
type Background=keyof typeof backgrounds;

export function useSiteAudio(location:string){
 const [sound,setSound]=useState(()=>localStorage.getItem('phantom-sound')==='true');
 const enabled=useRef(sound);enabled.current=sound;
 const route=useRef(location);route.current=location;
 const tracks=useRef<Partial<Record<Background,HTMLAudioElement>>>({});
 const effects=useRef<Partial<Record<EffectName,HTMLAudioElement>>>({});
 const throttles=useRef<Partial<Record<EffectName,number>>>({});
 const active=useRef<Background|null>(null);const fadeFrame=useRef(0);
 const effect=useCallback((name:EffectName)=>{
  if(!enabled.current||document.hidden)return;
  const now=performance.now();if(now-(throttles.current[name]??-1000)<(name==='swipe'?350:90))return;
  throttles.current[name]=now;
  let a=effects.current[name];if(!a){a=new Audio(asset('https://www.phantom.land/assets/sounds/'+name+'.mp3'));a.preload='auto';effects.current[name]=a;}
  a.volume=levels[name];a.currentTime=0;void a.play().catch(()=>{});
 },[]);
 const sync=useCallback(()=>{
  cancelAnimationFrame(fadeFrame.current);
  if(!enabled.current||document.hidden){Object.values(tracks.current).forEach(a=>a.pause());return;}
  const name:Background=route.current==='/'?'grid':route.current.startsWith('/projects/')?'project':'other';
  let next=tracks.current[name];if(!next){next=new Audio('/assets/sounds/'+name+'.mp3');next.loop=true;next.preload='auto';next.volume=0;next.dataset.phantomBackground=name;tracks.current[name]=next;}
  active.current=name;
  const fading=Object.values(tracks.current).filter(a=>a!==next).map(a=>({audio:a,volume:a.volume}));
  const initial=next.volume,start=performance.now();void next.play().catch(()=>{});
  const frame=(now:number)=>{const p=Math.max(0,Math.min((now-start)/650,1));next.volume=initial+(backgrounds[name]-initial)*p;
   fading.forEach(({audio,volume})=>{audio.volume=volume*(1-p);if(p===1)audio.pause();});
   if(p<1)fadeFrame.current=requestAnimationFrame(frame);
  };fadeFrame.current=requestAnimationFrame(frame);
 },[]);
 const enable=useCallback(()=>{enabled.current=true;setSound(true);localStorage.setItem('phantom-sound','true');sync();},[sync]);
 const toggle=useCallback(()=>{const next=!enabled.current;enabled.current=next;setSound(next);localStorage.setItem('phantom-sound',String(next));sync();if(next)effect('click');else Object.values(effects.current).forEach(a=>a.pause());},[sync,effect]);
 const click=useCallback(()=>effect('click'),[effect]);
 useEffect(()=>{sync();},[location,sound,sync]);
 useEffect(()=>{
  const resume=()=>{if(enabled.current)sync();};
  const hover=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;const target=e.target instanceof Element?e.target.closest('a,button'):null;
   if(target&&!target.contains(e.relatedTarget as Node|null)&&!target.matches('.sound-button,.phantom-intro,.filter-scrim'))effect('whoosh');};
  document.addEventListener('pointerdown',resume);document.addEventListener('keydown',resume);document.addEventListener('visibilitychange',sync);document.addEventListener('pointerover',hover);
  return()=>{cancelAnimationFrame(fadeFrame.current);document.removeEventListener('pointerdown',resume);document.removeEventListener('keydown',resume);document.removeEventListener('visibilitychange',sync);document.removeEventListener('pointerover',hover);[...Object.values(tracks.current),...Object.values(effects.current)].forEach(a=>{a.pause();a.removeAttribute('src');a.load();});tracks.current={};effects.current={};active.current=null;};
 },[sync,effect]);
 return {sound,toggle,click,enable,effect};
}