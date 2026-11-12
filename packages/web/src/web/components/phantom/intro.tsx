import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {asset} from '../../lib/site';
export default function Intro({done,ready}:{done:()=>void;ready:boolean}){
 const host=useRef<HTMLButtonElement>(null),doneRef=useRef(done),readyRef=useRef(ready);doneRef.current=done;readyRef.current=ready;
 useEffect(()=>{const el=host.current;if(!el)return;let r:THREE.WebGLRenderer;try{r=new THREE.WebGLRenderer({alpha:true,antialias:false});}catch{doneRef.current();return;}
  r.setClearColor(0x171717);r.domElement.style.imageRendering='pixelated';el.appendChild(r.domElement);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.01,100);camera.position.set(0,0,6);const group=new THREE.Group();scene.add(group);let disposed=false,raf=0,start=performance.now(),lastStep=0;
  const shader=new THREE.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:`varying vec3 pos;varying vec3 norm;void main(){pos=position;norm=normalMatrix*normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 pos;varying vec3 norm;uniform float time;void main(){float phase=(pos.y*.45+norm.x*.3+norm.z*.4+time*.2);vec3 col=.5+.5*cos(6.283*(phase+vec3(0.,.33,.67)));float edge=1.-abs(normalize(norm).z);col*=.32+edge*.85;col+=pow(edge,2.)*.2;gl_FragColor=vec4(col,1.);}`,side:THREE.DoubleSide});
  new GLTFLoader().load(asset('https://www.phantom.land/assets/models/dude.glb'),g=>{if(disposed)return;g.scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(g.scene),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());g.scene.position.sub(center);const wrapper=new THREE.Group();wrapper.add(g.scene);wrapper.scale.setScalar(3.55/Math.max(size.x,size.y,size.z));g.scene.traverse(o=>{if(o instanceof THREE.Mesh)o.material=shader;});group.add(wrapper);},undefined,()=>{doneRef.current()});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frame=(now:number)=>{const t=(now-start)/1000;shader.uniforms.time.value=t;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();const pixels=t<.8?48:t<1.25?72:t<1.75?100:t<2.2?150:Math.min(el.clientWidth,700);if(pixels!==lastStep){r.setSize(pixels,pixels/camera.aspect,false);lastStep=pixels;}group.rotation.y=Math.sin(t*.7)*.25;group.rotation.z=Math.sin(t)*.03;r.render(scene,camera);
   if((t>3.5&&readyRef.current)||reduced){doneRef.current();return;}raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);
  return()=>{disposed=true;cancelAnimationFrame(raf);shader.dispose();group.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose()});r.dispose();r.domElement.remove()};
 },[]);
 return <button className="phantom-intro" aria-label="Enter site" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(ready)done();}}} ref={host} onClick={()=>ready&&done()}><span className="intro-label mono">ENTER SITE</span></button>
}
