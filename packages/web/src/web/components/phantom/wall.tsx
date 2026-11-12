import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {cells,site,projects, type Cell} from '../../lib/site';

const vertex=`varying vec2 vUv; uniform vec2 screenSize; uniform vec2 motion; uniform float curve;
void main(){vUv=uv;vec4 p=modelMatrix*vec4(position,1.);vec2 n=p.xy/screenSize;
p.z-=curve*(n.x*n.x*.9+n.y*n.y*.2);p.x+=sin(n.y*2.)*motion.x*.025;p.y+=sin(n.x*2.)*motion.y*.02;
gl_Position=projectionMatrix*viewMatrix*p;}`;
const fragment=`varying vec2 vUv;uniform sampler2D rgb;uniform sampler2D alpha;uniform sampler2D labels;uniform vec2 cell;uniform float hovered;uniform float faded;
vec2 atlas(vec2 uv){return vec2((cell.y+uv.x)/6.,(5.-cell.x+uv.y)/6.);}
void main(){vec2 imageUV=(vUv-.5)/(.70+hovered*.035)+.5;
float inImage=step(0.,imageUV.x)*step(imageUV.x,1.)*step(0.,imageUV.y)*step(imageUV.y,1.);
vec4 media=texture2D(rgb,atlas(clamp(imageUV,0.001,.999)));float mask=texture2D(alpha,atlas(clamp(imageUV,0.001,.999))).r*inImage;
vec4 label=texture2D(labels,atlas(vUv));vec3 col=mix(vec3(.001),media.rgb,mask);col+=label.rgb*(.8+hovered*.2)*label.a;
float border=step(vUv.x,.001)+step(.999,vUv.x)+step(vUv.y,.001)+step(.999,vUv.y);col=mix(col,vec3(.16),min(border,1.));
gl_FragColor=vec4(col*faded,1.);}`;

export default function Wall({filtered,onSelect,onReady,flat=false}:{filtered:Cell[];onSelect:(slug:string)=>void;onReady:()=>void;flat?:boolean}) {
 const root=useRef<HTMLDivElement>(null);const callbacks=useRef({onSelect,onReady});callbacks.current={onSelect,onReady};
 const [fallback,setFallback]=useState(false);const filterRef=useRef(filtered);filterRef.current=filtered;
 const ctrl=useRef<{update:()=>void}|null>(null);
 useEffect(()=>{ctrl.current?.update()},[filtered]);
 useEffect(()=>{
  const el=root.current;if(!el)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{setFallback(true);callbacks.current.onReady();return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.setClearColor(0x000000);el.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','Interactive project wall. Drag to explore; use arrow keys to pan.');renderer.domElement.tabIndex=0;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(52,1,.01,100);camera.position.z=2.8;
  const loader=new THREE.TextureLoader();const videos:HTMLVideoElement[]=[];const textures:THREE.Texture[]=[];
  let cancelled=false;let count=0;
  const loaded=()=>{if(++count>=site.blueprint.atlases.length*3&&!cancelled)callbacks.current.onReady()};
  const packs=site.blueprint.atlases.map(a=>{
   const alpha=loader.load(a.mediaAlphaAtlas,loaded,undefined,loaded);const labels=loader.load(a.labelsAtlas,loaded,undefined,loaded);textures.push(alpha,labels);
   let rgb:THREE.Texture;
   if(a.type==='video') {const v=document.createElement('video');let marked=false;const mark=()=>{if(!marked){marked=true;loaded();}};v.addEventListener('loadeddata',mark,{once:true});v.addEventListener('error',mark,{once:true});v.src=a.mediaAtlas;v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';v.play().catch(()=>{});videos.push(v);rgb=new THREE.VideoTexture(v);}
   else rgb=loader.load(a.mediaAtlas,loaded,undefined,loaded);textures.push(rgb);rgb.minFilter=THREE.LinearFilter;rgb.magFilter=THREE.LinearFilter;return {rgb,alpha,labels};
  });
  const geometry=new THREE.PlaneGeometry(.998,.998,12,12);const uniforms= {screenSize:{value:new THREE.Vector2(2.5,1.75)},motion:{value:new THREE.Vector2()},curve:{value:flat?0:.35}};
  const mats=cells.map(c=>{const p=packs[c.atlas.index];return new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{...uniforms,rgb:{value:p.rgb},alpha:{value:p.alpha},labels:{value:p.labels},cell:{value:new THREE.Vector2(c.atlas.cellX,c.atlas.cellY)},hovered:{value:0},faded:{value:1}},side:THREE.DoubleSide})});
  // A tiled, wraparound wall. Every public project is available by panning.
  const cols=13,rows=8;const tiles:{mesh:THREE.Mesh;col:number;row:number;index:number}[]=[];
  const arrangement=cells.map((_,i)=>i);
  const opening=['Follow Your Flavour','Casamigos World Cup 2026','The Amigos Bottle','Don Julio World Class','Erase Your Ex','Casamigos Global Travel','AI Quests','Pixel for Travel'];
  opening.forEach((title,j)=>{const slot=(j<4?3:4)*cols+5+j%4;const index=cells.findIndex(c=>c.title===title);if(index<0)return;const old=arrangement.indexOf(index);[arrangement[slot],arrangement[old]]=[arrangement[old],arrangement[slot]];});
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=arrangement[(r*cols+c)%cells.length];const mesh=new THREE.Mesh(geometry,mats[i]);mesh.userData.slug=projects.find(p=>p.id===cells[i].id)?.uid;mesh.userData.cellId=cells[i].id;scene.add(mesh);tiles.push({mesh,col:c,row:r,index:i})}
  let allowed=new Set(filterRef.current.map(c=>c.id));ctrl.current={update(){allowed=new Set(filterRef.current.map(c=>c.id));for(const t of tiles)mats[t.index].uniforms.faded.value=allowed.has(cells[t.index].id)?1:.08;}};
  ctrl.current.update();
  const pos=new THREE.Vector2(-7,-4),target=pos.clone(),velocity=new THREE.Vector2();const motion=uniforms.motion.value;
  let w=0,h=0;const resize=()=>{w=el.clientWidth;h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();uniforms.screenSize.value.set(camera.position.z*Math.tan(52*Math.PI/360)*w/h,camera.position.z*Math.tan(52*Math.PI/360));};resize();const observer=new ResizeObserver(resize);observer.observe(el);
  let down=false,moved=false,lastX=0,lastY=0,startX=0,startY=0,pointer=new THREE.Vector2(20,20),selected:string|undefined,hover=-1;const raycaster=new THREE.Raycaster();
  const pan=(dx:number,dy:number)=>{const scale=uniforms.screenSize.value.y*2/h;target.x+=dx*scale;target.y-=dy*scale;velocity.set(dx*scale,-dy*scale);};
  const onDown=(e:PointerEvent)=>{down=true;moved=false;startX=lastX=e.clientX;startY=lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);el.style.cursor='grabbing';for(const v of videos)v.play().catch(()=>{});};
  const onMove=(e:PointerEvent)=>{pointer.set(e.clientX/w*2-1,-e.clientY/h*2+1);if(down){if(Math.hypot(e.clientX-startX,e.clientY-startY)>5)moved=true;pan(e.clientX-lastX,e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;}};
  const onUp=()=>{down=false;el.style.cursor='grab';if(!moved&&selected)callbacks.current.onSelect(selected);};
  const onWheel=(e:WheelEvent)=>{e.preventDefault();pan(-e.deltaX*.5,-e.deltaY*.5)};
  const onKey=(e:KeyboardEvent)=>{const dirs:Record<string,[number,number]>={ArrowLeft:[100,0],ArrowRight:[-100,0],ArrowUp:[0,100],ArrowDown:[0,-100]};if(dirs[e.key]){e.preventDefault();pan(...dirs[e.key]);}if(e.key==='Enter'&&selected)callbacks.current.onSelect(selected);};
  const canvas=renderer.domElement;canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onUp);canvas.addEventListener('wheel',onWheel,{passive:false});canvas.addEventListener('keydown',onKey);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let raf=0,last=performance.now();
  const render=(now:number)=>{const dt=Math.min((now-last)/16.67,3);last=now;if(!down){target.addScaledVector(velocity,.25*dt);velocity.multiplyScalar(Math.pow(.90,dt));}pos.lerp(target,reduced?1:.13);motion.copy(target).sub(pos);
   for(const t of tiles){let x=t.col+pos.x+.5,y=t.row+pos.y+.5;x-=Math.round(x/cols)*cols;y-=Math.round(y/rows)*rows;t.mesh.position.set(x,y,0);}
   raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(tiles.map(t=>t.mesh));const hit=hits.find(x=>allowed.has(x.object.userData.cellId));selected=hit?.object.userData.slug;
   hover=hit?tiles.findIndex(t=>t.mesh===hit.object):-1;for(let i=0;i<mats.length;i++){const val=hover>=0&&tiles[hover].index===i?1:0;mats[i].uniforms.hovered.value=THREE.MathUtils.lerp(mats[i].uniforms.hovered.value,val,.09);}
   if(!down)el.style.cursor=selected?'pointer':'grab';renderer.render(scene,camera);raf=requestAnimationFrame(render);};raf=requestAnimationFrame(render);
  return()=>{cancelled=true;cancelAnimationFrame(raf);observer.disconnect();videos.forEach(v=>{v.pause();v.removeAttribute('src');v.load()});textures.forEach(t=>t.dispose());mats.forEach(m=>m.dispose());geometry.dispose();renderer.dispose();canvas.remove();ctrl.current=null;};
 },[flat]);
 return <div ref={root} className="project-wall">{fallback&&<div className="wall-fallback">{filtered.map(c=><button key={c.id} onClick={()=>onSelect(projects.find(p=>p.id===c.id)?.uid||'')}><small>{c.client} <span>{c.title}</span></small><img src={c.mediaType==='image'?c.mediaUrl:projectThumbnail(c)} alt={c.title}/><small>{c.zone} · {c.features.slice(0,2).join(' ')}<span>{c.launchDate.slice(0,4)}</span></small></button>)}</div>}</div>
}
function projectThumbnail(c:Cell){return projects.find(p=>p.id===c.id)?.data.hero?.[0]?.alternate_media?.url||'';}
