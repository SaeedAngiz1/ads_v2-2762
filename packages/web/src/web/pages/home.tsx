import {useMemo,useState,useEffect} from 'react';
import {Link,useLocation} from 'wouter';
import {Grid2X2,List,ArrowDown,Search} from 'lucide-react';
import {cells,projects,docs} from '../lib/site';
import {usePageTheme} from '../lib/theme';
import Wall from '../components/phantom/wall';
import Intro from '../components/phantom/intro';
import {Pills} from '../components/phantom/media';
import {useSound} from '../components/phantom/shell';

type Filter={zone:string[];feature:string[];service:string[];client:string[]};
const blank:Filter={zone:[],feature:[],service:[],client:[]};
function queryFilters():Filter{const params=new URLSearchParams(window.location.search);return Object.fromEntries(Object.keys(blank).map(key=>[key,params.getAll(key).flatMap(v=>v.split(',')).filter(Boolean)])) as Filter;}
export default function Home(){
 usePageTheme();const [,navigate]=useLocation();const {click}=useSound();
 const [intro,setIntro]=useState(()=>!sessionStorage.getItem('phantom-intro')),[ready,setReady]=useState(false),[mode,setMode]=useState<'grid'|'list'>('grid'),[open,setOpen]=useState(false),[filters,setFilters]=useState<Filter>(queryFilters),[search,setSearch]=useState(''),[sort,setSort]=useState(false);
 useEffect(()=>{const params=new URLSearchParams();for(const [key,values] of Object.entries(filters))for(const value of values)params.append(key,value);const query=params.toString();window.history.replaceState(window.history.state,'',window.location.pathname+(query?'?'+query:''));},[filters]);
 useEffect(()=>{const update=()=>setFilters(queryFilters());window.addEventListener('popstate',update);return()=>window.removeEventListener('popstate',update);},[]);
 const visible=useMemo(()=>projects.filter(p=>{
  const d=p.data;return (!search||(d.title||'').toLowerCase().includes(search.toLowerCase()))&&(!filters.zone.length||filters.zone.includes(d.zone?.uid))&&(!filters.service.length||filters.service.includes(d.service?.uid))&&(!filters.client.length||d.clients.some((c:any)=>filters.client.includes(c.client?.uid)))&&(!filters.feature.length||d.features.some((f:any)=>filters.feature.includes(f.feature?.uid)));
 }),[filters,search]);
 const filtered=useMemo(()=>cells.filter(c=>visible.some(p=>p.id===c.id)),[visible]);const ordered=sort?[...visible].reverse():visible;const years=[...new Set(ordered.map(p=>p.data.launch_date?.slice(0,4)))];
 const toggle=(key:keyof Filter,value:string)=>{click();setFilters(f=>({...f,[key]:f[key].includes(value)?f[key].filter(x=>x!==value):[...f[key],value]}))};
 const complete=()=>{sessionStorage.setItem('phantom-intro','true');setIntro(false)};
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[]);
 return <main className={'home-page '+(mode==='list'?'list-mode':'')+(open?' filters-open':'')}>
  <Wall filtered={filtered} onSelect={slug=>{click();navigate('/projects/'+slug)}} onReady={()=>setReady(true)}/>
  <div className="wall-vignette"/>
  {mode==='list'&&<section className="archive"><div className="archive-heading"><h1>{search?'Search results':'All projects'}</h1><h2>{visible.length} projects</h2><button aria-label="Reverse chronological order" onClick={()=>setSort(!sort)}><ArrowDown size={22}/></button></div>
   {years.map(year=><div className="archive-year" key={year}><h3>{year}</h3><div className="archive-rows">{ordered.filter(p=>p.data.launch_date?.startsWith(year)).map(p=><Link href={'/projects/'+p.uid} key={p.id} className="archive-row" onClick={click}><span className="archive-title">{p.data.title}</span><Pills items={[p.data.zone.uid,...p.data.features.slice(0,3).map((f:any)=>f.feature.uid)]}/><span className="archive-client">{p.data.clients.map((c:any)=>docs.find(x=>x.id===c.client.id)?.data.client_name).filter(Boolean).slice(0,1).join(', ')}</span></Link>)}</div></div>)}
   {!visible.length&&<p className="empty-state">No projects match these filters.<button onClick={()=>{setFilters(blank);setSearch('')}}>Clear filters</button></p>}
  </section>}
  <div className="view-toggle"><button className={mode==='grid'?'active':''} onClick={()=>{click();setMode('grid')}} title="Grid view" aria-label="Grid view"><Grid2X2 size={17}/></button><button className={mode==='list'?'active':''} onClick={()=>{click();setMode('list')}} title="List view" aria-label="List view"><List size={17}/></button></div>
  <button className="filter-toggle" onClick={()=>{click();setOpen(!open)}}>{open?'Close':'Filter'}{!open&&Object.values(filters).flat().length>0&&<span>{Object.values(filters).flat().length}</span>}</button>
  {open&&<><button className="filter-scrim" aria-label="Close filters" onClick={()=>setOpen(false)}/><aside className="filter-panel" aria-label="Project filters"><div className="filter-panel-heading"><span className="mono">EXPLORE OUR WORK</span><button onClick={()=>{setFilters(blank);setSearch('')}} className="mono">RESET ALL ↗</button></div><div className="filter-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects" aria-label="Search projects"/></div><div className="filter-columns">
   <div><FilterGroup title="FILTER BY ZONE" items={['product','experience','communication']} selected={filters.zone} onChange={v=>toggle('zone',v)} big/><FilterGroup title="FEATURE" items={docs.filter(d=>d.type==='case_study_feature').map(d=>d.uid).sort()} selected={filters.feature} onChange={v=>toggle('feature',v)}/></div>
   <div><FilterGroup title="REGION" items={['global','emea','apac','amer']} selected={filters.service} onChange={v=>toggle('service',v)}/><FilterGroup title="PARTNER" items={docs.filter(d=>d.type==='client'&&!d.data.disable_filter&&!d.data.hide_from_about_page).map(d=>d.uid)} selected={filters.client} onChange={v=>toggle('client',v)} names={Object.fromEntries(docs.filter(d=>d.type==='client').map(d=>[d.uid,d.data.client_name]))}/></div>
  </div><div className="filter-footer"><span className="mono">{visible.length} PROJECTS</span><button className="white-button" onClick={()=>{setMode('list');setOpen(false)}}>View results ↗</button></div></aside></>}
  {intro&&<Intro ready={ready} done={complete}/>}
 </main>
}
function FilterGroup({title,items,selected,onChange,big=false,names={}}:{title:string;items:string[];selected:string[];onChange:(v:string)=>void;big?:boolean;names?:Record<string,string>}){return <section className={'filter-group '+(big?'big':'')}><h2 className="mono">{title}</h2><div>{items.map(item=><button key={item} className={selected.includes(item)?'selected':''} onClick={()=>onChange(item)} aria-pressed={selected.includes(item)}>{names[item]||item}<span>{selected.includes(item)?'−':'+'}</span></button>)}</div></section>}
