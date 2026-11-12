import {useState} from 'react';
import {Link,useParams} from 'wouter';
import {getDoc,docs,byId,href} from '../lib/site';
import {usePageTheme} from '../lib/theme';
import {Media,Rich,Label} from '../components/phantom/media';
import {Footer,useSound} from '../components/phantom/shell';
import {Team} from '../components/phantom/portrait';
export default function About(){const {slug='agency'}=useParams();const page=getDoc('about_page',slug)||getDoc('about_page','agency')!;const data=page.data;usePageTheme(data.background_colour,slug==='approach'?'#181818':'#ffffff');const {sound}=useSound();return <main className="editorial-page about-page" key={slug}>{data.slices.map((s:any)=>{const p=s.primary;
 if(s.slice_type==='about_columns'){
  if(p.page_title)return <section key={s.id} className="about-intro page-width"><div className="about-tabs"><Link href="/about/agency" className={slug==='agency'?'active':''}>Agency</Link><Link href="/about/approach" className={slug==='approach'?'active':''}>Approach</Link></div><h1>{p.description}</h1></section>;
  if(s.variation==='aboutColumns4ColumnZone')return <section className="zone-section page-width reveal" key={s.id}><div className="zone-index mono">{p.row_number&&<span>{p.row_number.padStart(2,'0')}</span>}{p.row_icon?.url&&<img src={p.row_icon.url} alt=""/>}</div><h2>{p.zone_title||byId(p.linked_zone?.id)?.data.title||p.linked_zone?.uid}</h2><div className="zone-description"><Rich value={p.zone_description}/>{p.zone_link_text&&<Link href={'/?zone='+p.linked_zone?.uid} className="mono">{p.zone_link_text} ↗</Link>}{p.list_items?.map((x:any,j:number)=><Rich key={j} value={x.description||x.list_item}/>)}</div><Media src={p.list_video?.url||p.list_image?.url} type={p.list_video?.url?'video':'image'} className={p.list_video_blending?'blend':''}/></section>;
  return <section className="about-copy page-width reveal" key={s.id}><Label>{p.sub_text}</Label><div><p>{p.description}</p>{p.cta_link?.url&&<Link href={href(p.cta_link)} className="white-button">Explore ↗</Link>}{p.image?.url&&<Media src={p.image.url}/>}<Media src={p.video?.url} type="video" className={p.video_blending?'blend':''}/></div></section>;
 }
 if(s.slice_type==='about_scrolling_carousel')return <div className="marquee-media" key={s.id}><div>{[...s.items,...s.items].map((item:any,j:number)=><Media src={item.video_url||item.image?.url} alt="Phantom selected work" key={j}/>)}</div></div>;
 if(s.slice_type==='hero_video')return <Reel key={s.id} src={p.source?.url} sound={sound}/>;
 if(s.slice_type==='about_logo_grid')return <section className="partner-grid page-width reveal" key={s.id}>{docs.filter(d=>d.type==='client'&&!d.data.hide_from_about_page).sort((a,b)=>(a.data.display_order||99)-(b.data.display_order||99)).map(d=><Link key={d.id} href={'/?client='+d.uid} aria-label={'View work for '+d.data.client_name}><img src={d.data.client_logo?.url} alt={d.data.client_name}/></Link>)}</section>;
 if(s.slice_type==='about_where_we_are')return <section className="studio-offices page-width reveal" key={s.id}>{p.office.map((o:any,j:number)=><article key={j}><img src={o.logo?.url} alt={o.name}/><Rich className="mono" value={o.address}/><Rich className="mono" value={o.contact}/>{o.image?.url&&<Media src={o.image.url}/>}</article>)}</section>;
 if(s.slice_type==='team_section')return <div className="page-width" key={s.id}><Team/></div>;
 if(s.slice_type==='image_gallery')return <section className="page-width media-gallery reveal" key={s.id}>{s.items.map((it:any,j:number)=><Media key={j} src={it.video_desktop_compression_url||it.image?.url}/>)}</section>;
 if(s.slice_type==='about_awards_list')return <section className="award-list page-width reveal" key={s.id}>{docs.filter(d=>d.type==='award_recognition').map(d=><a href={href(d.data.award_recognition_link)} target="_blank" rel="noreferrer" key={d.id}><span>{d.data.project_title}</span><span className="mono">{d.data.awarding_body}<br/>{d.data.award_recognition_name}</span><span>{d.data.year_awarded} ↗</span></a>)}</section>;
 return null;
 })}<Footer/></main>}
function Reel({src,sound}:{src:string;sound:boolean}){const [play,setPlay]=useState(false);return <section className="reel"><Media src={src} sound={play&&sound} controls={play}/>{!play&&<button onClick={()=>setPlay(true)}>PLAY ↗</button>}</section>}
