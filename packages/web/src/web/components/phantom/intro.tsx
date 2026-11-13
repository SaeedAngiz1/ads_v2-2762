import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {asset} from '../../lib/site';
import {useSound} from './shell';

export default function Intro({done,ready}:{done:()=>void;ready:boolean}){
 const host=useRef<HTMLDivElement>(null),label=useRef<HTMLSpanElement>(null);
 const doneRef=useRef(done),readyRef=useRef(ready);doneRef.current=done;readyRef.current=ready;
 const audio=useSound(),audioRef=useRef(audio);audioRef.current=audio;
 const [phase,setPhase]=useState('loading'),[progress,setProgress]=useState(0);
 useEffect(()=>{
  const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;
  let stopped=false,raf=0,loadedCount=0,started:number|null=null,announced=false,lastPhase='loading';
  const textures:THREE.Texture[]=[];const frames:(THREE.Texture|undefined)[]=[];
  const geometries:THREE.BufferGeometry[]=[];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false});}catch{doneRef.current();return;}
  renderer.setClearColor(0x000000,1);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  el.prepend(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,10);camera.position.z=4;
  const geometry=new THREE.PlaneGeometry(2,2);geometries.push(geometry);
  const uniforms={first:{value:null as THREE.Texture|null},second:{value:null as THREE.Texture|null},blend:{value:0},pixels:{value:80},resolution:{value:new THREE.Vector2()},imageAspect:{value:16/9},screenAspect:{value:1},opacity:{value:0}};
  const material=new THREE.ShaderMaterial({transparent:true,uniforms,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`varying vec2 vUv;uniform sampler2D first;uniform sampler2D second;uniform float blend;uniform float pixels;uniform float screenAspect;uniform float imageAspect;uniform vec2 resolution;uniform float opacity;
    void main(){vec2 uv=vUv;if(screenAspect>imageAspect)uv.x=(uv.x-.5)*screenAspect/imageAspect+.5;else uv.y=(uv.y-.5)*imageAspect/screenAspect+.5;
    if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.){gl_FragColor=vec4(0.,0.,0.,opacity);return;}
    if(pixels>1.){vec2 stepSize=vec2(pixels)/resolution;uv=stepSize*(floor(uv/stepSize)+.5);}
    vec3 color=mix(texture2D(first,uv).rgb,texture2D(second,uv).rgb,pow(blend,3.));gl_FragColor=vec4(color,opacity);}`});
  const quad=new THREE.Mesh(geometry,material);scene.add(quad);
  const cloudMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{scatter:{value:0},opacity:{value:0},time:{value:0}},
   vertexShader:`attribute vec3 drift;varying vec3 tint;uniform float scatter;uniform float time;void main(){vec3 p=position+drift*scatter;float phase=position.y*.7+time*.1;tint=.5+.5*cos(6.283*(phase+vec3(0.,.33,.67)));gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);gl_PointSize=2.4;}`,
   fragmentShader:`varying vec3 tint;uniform float opacity;void main(){float r=length(gl_PointCoord-.5);if(r>.5)discard;gl_FragColor=vec4(tint,opacity*(1.-r*2.));}`});
  const cloudGroup=new THREE.Group();scene.add(cloudGroup);
  const mark=()=>{if(stopped)return;loadedCount++;setProgress(Math.round(loadedCount/26*75+(readyRef.current?25:0)));};
  const variant=innerWidth<700?'mobile':'desktop';const loader=new THREE.TextureLoader();
  for(let i=0;i<25;i++){
   const texture=loader.load(`/assets/intro/${variant}-${i}.webp`,t=>{frames[i]=t;uniforms.imageAspect.value=t.image.width/t.image.height;mark();},undefined,mark);
   texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;textures.push(texture);
  }
  new GLTFLoader().load(asset('https://www.phantom.land/assets/models/dude.glb'),g=>{
   if(stopped){g.scene.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});return;}
   g.scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(g.scene),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
   const scale=1.7/Math.max(size.x,size.y,size.z),positions:number[]=[],drifts:number[]=[],v=new THREE.Vector3();
   g.scene.traverse(o=>{if(o instanceof THREE.Mesh){const attr=o.geometry.getAttribute('position');for(let i=0;i<attr.count;i+=2){v.fromBufferAttribute(attr,i).applyMatrix4(o.matrixWorld).sub(center).multiplyScalar(scale);positions.push(v.x,v.y,v.z);drifts.push(Math.sin(i*12.32)*3,Math.cos(i*7.18)*3,Math.sin(i*4.3)*2);}
    o.geometry.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('drift',new THREE.Float32BufferAttribute(drifts,3));geometries.push(geo);cloudGroup.add(new THREE.Points(geo,cloudMaterial));mark();
  },undefined,mark);
  const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);uniforms.resolution.value.set(el.clientWidth,el.clientHeight);uniforms.screenAspect.value=el.clientWidth/el.clientHeight;cloudGroup.scale.x=1/uniforms.screenAspect.value;};
  resize();const observer=new ResizeObserver(resize);observer.observe(el);const boot=performance.now();
  const phaseTo=(value:string)=>{if(lastPhase!==value){lastPhase=value;setPhase(value);}};
  const render=(now:number)=>{
   if(stopped)return;
   if(started===null&&loadedCount>=26&&readyRef.current&&now-boot>=1500){started=now;setProgress(100);phaseTo('reveal');}
   if(started!==null){const elapsed=(now-started)/1000;
    if(reduced&&elapsed>.25){doneRef.current();return;}
    if(elapsed>1){const t=elapsed-1;phaseTo(t<2.6?'frames':'exit');
     const available=frames.filter((f):f is THREE.Texture=>Boolean(f));
     if(available.length){let index=0;if(t>=.8)index=Math.min(24,Math.floor((t-.8)/1.8*25));uniforms.first.value=frames[index]||available[0];uniforms.second.value=frames[(index+1)%25]||available[0];uniforms.blend.value=t<.8?0:((t-.8)/1.8*25)%1;
      uniforms.pixels.value=t<.8?[80,70,60,50,40,30,20,10,1][Math.min(8,Math.floor(t/.8*9))]:1;uniforms.opacity.value=t<2.6?1:Math.max(0,1-(t-2.6)*8);}
     cloudMaterial.uniforms.time.value=t;cloudMaterial.uniforms.opacity.value=t<2.3?0:Math.min(1,(t-2.3)*4)*Math.max(0,1-(t-2.8)*2);
     cloudMaterial.uniforms.scatter.value=Math.pow(Math.max(0,t-2.65),2)*14;cloudGroup.rotation.y=Math.max(0,t-2.5)*4.2;
     if(t>2.55&&!announced){announced=true;audioRef.current.effect('load');audioRef.current.effect('whoosh');}
     if(t>3.35){doneRef.current();return;}
    }
   }
   if(lastPhase==='exit')renderer.setClearColor(0x000000,0);renderer.render(scene,camera);raf=requestAnimationFrame(render);
  };raf=requestAnimationFrame(render);
  return()=>{stopped=true;cancelAnimationFrame(raf);observer.disconnect();textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());material.dispose();cloudMaterial.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className={'phantom-intro intro-'+phase} ref={host}>
  <output className="boot-loader" aria-label="Loading website"><div className="boot-type"><h2><span>PHANTOM STUDIOS®</span></h2><h2><span>TECHNOLOGY CREATIVE</span></h2></div><div className="boot-progress" style={{transform:`scaleX(${progress/100})`}}/></output>
  <button className="intro-sound-hit" aria-label={audio.sound?'Sound enabled during opening':'Enable sound during opening'} onClick={()=>{audio.enable();audio.effect('riser');}} onPointerMove={e=>{if(label.current)label.current.style.transform=`translate(${e.clientX+12}px,${e.clientY+16}px)`;}}><span ref={label} className="intro-sound-label mono">{audio.sound?'SOUND ENABLED':'CLICK TO ENABLE SOUND'}</span></button>
 </div>;
}
