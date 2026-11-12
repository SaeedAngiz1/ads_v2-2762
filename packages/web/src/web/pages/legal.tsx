import {Link,useParams} from 'wouter';
import {getDoc,text} from '../lib/site';
import {usePageTheme} from '../lib/theme';
import {Rich,Label} from '../components/phantom/media';
import {Footer} from '../components/phantom/shell';
export default function Legal(){const {slug}=useParams();const p=getDoc('page',slug);usePageTheme('#181818','#ffffff');if(!p)return <main className="not-found"><h1>SORRY, WE DIDN'T MEAN TO GHOST YOU.</h1><Link href="/">Return home</Link></main>;return <main className="editorial-page legal-page"><div className="legal-note page-width mono">SOURCE WEBSITE POLICY — RETAINED FOR VISUAL REFERENCE. THIS CLONE IS NOT OPERATED BY PHANTOM STUDIOS.</div>{p.data.slices.map((s:any)=>{const d=s.primary;if(s.variation==='title')return <section className="legal-title page-width" key={s.id}><Label>{d.label||'PHANTOM'}</Label><h1>{d.title||text(p.data.title)}</h1></section>;return <section className="legal-copy page-width reveal" key={s.id}><Label>{d.label}</Label><div><Rich value={d.description}/>{d.columns?.map((c:any,i:number)=><div className="legal-columns" key={i}><Rich value={c.left_column}/><Rich value={c.right_column}/></div>)}</div></section>})}<Footer/></main>}
