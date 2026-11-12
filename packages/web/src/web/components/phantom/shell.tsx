import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {Link,useLocation} from 'wouter';
import {asset,getDoc,href} from '../../lib/site';
import {Rich} from './media';
const SoundContext=createContext({sound:false,toggle:()=>{},click:()=>{}});
export const useSound=()=>useContext(SoundContext);
export function Shell({children}:{children:ReactNode}){
 const [location]=useLocation();const [sound,setSound]=useState(()=>localStorage.getItem('phantom-sound')==='true');const [cookies,setCookies]=useState(()=>!localStorage.getItem('phantom-cookie'));
 const [time,setTime]=useState(new Date());useEffect(()=>{const id=setInterval(()=>setTime(new Date()),30000);return()=>clearInterval(id)},[]);
 const click=()=>{if(sound){const audio=new Audio(asset('https://www.phantom.land/assets/sounds/click.mp3'));audio.volume=.25;audio.play().catch(()=>{})}};
 const toggle=()=>{const next=!sound;setSound(next);localStorage.setItem('phantom-sound',String(next));if(next){const a=new Audio(asset('https://www.phantom.land/assets/sounds/load.mp3'));a.volume=.25;a.play().catch(()=>{})}};
 useEffect(()=>{window.scrollTo(0,0);document.title=location==='/'?'Phantom — Technology Creative':`${location.split('/').pop()?.replaceAll('-',' ')} — Phantom`;},[location]);
 const agency=location.startsWith('/about'),career=location.startsWith('/careers'),contact=location.startsWith('/contact');
 const clock=(zone:string)=>new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(time);
 return <SoundContext.Provider value={{sound,toggle,click}}><div className="site-shell">
  <header className="site-header">
   <Link href="/" className="ghost-logo" aria-label="Phantom home" onClick={click}><img src={getDoc('header')?.data.logo.url} alt="Phantom"/></Link>
   <button className="sound-button mono" onClick={toggle} aria-label={sound?'Disable sound':'Enable sound'}><span className={'equalizer '+(sound?'playing':'')}>{Array.from({length:12},(_,i)=><i key={i} style={{animationDelay:`${i*.08}s`}}/>)}</span>SOUND [{sound?'ON':'OFF'}]</button>
   <p className="studio-description mono">PHANTOM IS A TECHNOLOGY-LED<br/>CREATIVE AGENCY CRAFTING<br/>EXPERIENCES FOR GLOBAL BRANDS.</p>
   <div className="studio-clocks mono"><p><i/> LONDON, UK <span>{clock('Europe/London')} GMT+0</span></p><p><i/> AUCKLAND, NZ <span>{clock('Pacific/Auckland')} GMT+13</span></p></div>
   {!contact&&<Link href="/contact" className="talk-button" onClick={click}>Let's Talk</Link>}{contact&&<Link href="/" className="close-contact" aria-label="Close contact">×</Link>}
  </header>
  {children}
  {!contact&&<nav className="main-dock" aria-label="Main navigation"><Link href="/" className={!agency&&!career?'active':''} onClick={click}>Work</Link><Link href="/about/agency" className={agency?'active':''} onClick={click}>About</Link><Link href="/careers" className={career?'active':''} onClick={click}>Careers</Link></nav>}
  {cookies&&<aside className="cookie-banner" aria-label="Cookie preferences"><p className="mono">WE USE COOKIES TO<br/>ANALYSE OUR<br/>TRAFFIC. FOR MORE<br/>INFO, READ OUR<br/><Link href="/privacy-policy">PRIVACY POLICY</Link></p><button onClick={()=>{localStorage.setItem('phantom-cookie','accepted');setCookies(false)}}>Accept</button><button className="decline" onClick={()=>{localStorage.setItem('phantom-cookie','declined');setCookies(false)}}>Decline</button></aside>}
 </div></SoundContext.Provider>
}
export function Footer(){const f=getDoc('footer')?.data;return <footer className="site-footer"><div className="footer-top"><div className="footer-address mono"><Rich value={f?.uk_office_address}/><a href="mailto:boo@phantom.agency">BOO@PHANTOM.AGENCY</a></div><div className="footer-address mono"><Rich value={f?.nz_office_address}/><a href="https://phq.nz" target="_blank" rel="noreferrer">PHQ.NZ ↗</a></div><div className="footer-social mono"><a href="https://www.instagram.com/phntmldn" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://www.linkedin.com/company/phantom" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div><Link href="/contact" className="footer-dude"><img src={f?.main_images?.[0]?.main_image?.url} alt="Let's talk"/></Link></div><Link href="/contact" className="footer-heading">Let's talk<span>↗</span></Link><div className="footer-bottom mono"><span>{f?.company_name}</span><div>{f?.other_links?.map((x:any)=><Link key={x.link.uid} href={href(x.link)}>{x.link.text}</Link>)}<button onClick={()=>{localStorage.removeItem('phantom-cookie');window.location.reload()}}>Cookie settings</button></div><span>© {new Date().getFullYear()}</span></div></footer>}
