import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Link} from 'wouter';
import {href} from '../../lib/site';
export function Media({src,type,alt='',className='',sound=false,controls=false,poster}:{src?:string;type?:string;alt?:string;className?:string;sound?:boolean;controls?:boolean;poster?:string}){
 const video=useRef<HTMLVideoElement>(null);const [failed,setFailed]=useState(false);const isVideo=type==='video'||/\.(mp4|webm)(\?|$)/i.test(src||'');
 useEffect(()=>setFailed(false),[src]);
 useEffect(()=>{const v=video.current;if(!v)return;const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)v.play().catch(()=>{});else v.pause();})},{rootMargin:'100px'});io.observe(v);return()=>io.disconnect();},[src]);
 if(!src)return null;
 if(isVideo&&!failed)return <video className={'media '+className} ref={video} src={src} poster={poster||'/posters/'+src.split('/').pop()?.replace(/\.[^.]+$/,'.jpg')} aria-label={alt||'Project film'} muted={!sound} loop playsInline controls={controls} preload="metadata" onError={()=>setFailed(true)}><track kind="captions" src="/captions/ambient.vtt" srcLang="en" label="Ambient film"/></video>;
 if(failed&&!poster)return <div className={'media media-unavailable '+className}><span className="mono">FILM UNAVAILABLE IN THE SOURCE ARCHIVE</span></div>;
 return <img className={'media '+className} src={failed?poster:src} alt={alt} loading="lazy"/>;
}
export function Rich({value,className=''}:{value:any;className?:string}){
 if(!value)return null;if(typeof value==='string')return <div className={className}>{value.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}</div>;
 return <div className={'rich '+className}>{value.map((row:any,i:number)=>{if(!row.text)return null;const content=spanned(row);if(row.type==='heading1')return <h1 key={i}>{content}</h1>;if(row.type==='heading2')return <h2 key={i}>{content}</h2>;if(row.type==='heading3')return <h3 key={i}>{content}</h3>;if(row.type==='heading4')return <h4 key={i}>{content}</h4>;if(row.type==='list-item')return <p className="list-item" key={i}>{content}</p>;if(row.type==='o-list-item')return <p className="list-item" key={i}>{content}</p>;return <p key={i}>{content}</p>;})}</div>
}
function spanned(row:any):ReactNode{const spans=row.spans||[],bounds=[...new Set<number>([0,row.text.length,...spans.flatMap((s:any)=>[s.start,s.end])])].sort((a,b)=>a-b);return bounds.slice(0,-1).map((start,i)=>{const end=bounds[i+1];let out:ReactNode=row.text.slice(start,end);for(const s of spans.filter((s:any)=>s.start<=start&&s.end>=end)){if(s.type==='strong')out=<strong>{out}</strong>;if(s.type==='em')out=<em>{out}</em>;if(s.type==='hyperlink'){const url=href(s.data);out=url.startsWith('/')?<Link href={url}>{out}</Link>:<a href={url} target="_blank" rel="noreferrer">{out}</a>;}}return <span key={i}>{out}</span>})}
export function Label({children}:{children:ReactNode}){return <span className="eyebrow mono"><i/>{children}</span>}
export function Pills({items}:{items:string[]}){return <span className="pills">{items.filter(Boolean).map(x=><span className="pill mono" key={x}>{x}</span>)}</span>}
