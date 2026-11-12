import raw from './site-data.json';
export type Doc = {id:string;uid:string;type:string;data:Record<string,any>};
export type Cell = {id:string;title:string;mediaType:string;mediaUrl:string;logoUrl:string;client:string;zone:string;atlas:{index:number;cellX:number;cellY:number};launchDate:string;features:string[]};
export const site=raw as unknown as {documents:Doc[];blueprint:{atlases:{type:string;mediaAtlas:string;mediaAlphaAtlas:string;labelsAtlas:string}[];cells:Cell[]};assets:Record<string,string>};
export const docs=site.documents;
export const byId=(id:string)=>docs.find(d=>d.id===id);
export const getDoc=(type:string,uid?:string)=>docs.find(d=>d.type===type&&(!uid||d.uid===uid));
export const projects=docs.filter(d=>d.type==='project').sort((a,b)=>(b.data.launch_date||'').localeCompare(a.data.launch_date||''));
export const cells=site.blueprint.cells.filter(c=>projects.some(p=>p.id===c.id));
export const text=(rich:any)=>Array.isArray(rich)?rich.map(r=>r.text||'').join('\n'):typeof rich==='string'?rich:'';
export const asset=(url:string)=>site.assets[url]||url;
export const projectCell=(p:Doc)=>cells.find(c=>c.id===p.id);
export function href(link:any):string {
 if(!link)return '#';
 if(link.link_type==='Document') {const d=byId(link.id);if(d?.type==='project')return '/projects/'+d.uid;if(d?.type==='jobs')return '/careers/'+d.uid;if(d?.type==='about_page')return '/about/'+d.uid;return '/'+(d?.uid||link.uid||'');}
 const url=link.url||'#';return url.replace('https://www.phantom.land','');
}
