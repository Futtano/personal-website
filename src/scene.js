import * as THREE from 'three';

export function initWorld({onComputer,onLocation,onNearComputer,onFailure}) {
 const host=document.querySelector('#world');
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
 renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#c3d6d3');scene.fog=new THREE.Fog('#c3d6d3',38,145);
 const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.08,240);camera.rotation.order='YXZ';
 const mats={};
 function mat(color,extra={}){const key=color+JSON.stringify(extra);return mats[key]??=(new THREE.MeshStandardMaterial({color,roughness:1,...extra}));}
 const colliders=[];
 function box(w,h,d,x,y,z,color,solid=false,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);if(solid)colliders.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});return m;}
 function cylinder(rt,rb,h,x,y,z,color,n=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
 function sphere(r,x,y,z,color,scale=[1,1,1],detail=0){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,detail),mat(color));m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
 function textPlane(text,w,h,x,y,z,bg='#e8dfc1',color='#536256',size=44){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,256);ctx.fillStyle=color;ctx.textAlign='center';ctx.font=`${size}px Georgia`;text.split('\n').forEach((line,i)=>ctx.fillText(line,256,105+i*60));const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));mesh.position.set(x,y,z);scene.add(mesh);return mesh;}
 scene.add(new THREE.HemisphereLight('#edf1dc','#927e59',2.7));
 const sun=new THREE.DirectionalLight('#ffe6ba',3.6);sun.position.set(-18,28,14);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-25;sun.shadow.normalBias=.045;scene.add(sun);
 const warm=new THREE.PointLight('#ffcf83',20,12,2);warm.position.set(-2.6,2.65,-1.4);scene.add(warm);
 const kitchenLight=new THREE.PointLight('#ffefd0',15,12,2);kitchenLight.position.set(3,2.5,-5);scene.add(kitchenLight);
 // A pale beach, a shallow turquoise shelf, and a horizon that disappears in haze.
 box(160,.2,180,42,-.18,0,'#dacba8');
 const sea=box(130,.12,200,-85,-.13,0,mat('#579fa0',{roughness:.3,metalness:.12}));sea.castShadow=false;
 box(8,.025,180,-19,-.05,0,mat('#8bc5bd',{roughness:.55})).castShadow=false;
 box(2.5,.025,180,-14.8,-.045,0,'#c3d3b6').castShadow=false;
 const waves=[];
 for(let i=0;i<13;i++){const wave=box(.10,.025,150,-17-i*2,.025,0,mat('#e5f0d9',{transparent:true,opacity:.25}));wave.castShadow=false;waves.push(wave);}
 // Deterministic scattered granite and hardy coastal scrub.
 let seed=23;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
 for(let i=0;i<100;i++){
 const x=-12+random()*52,z=-46+random()*78;
 if(x>-7&&x<9&&z>-11&&z<17)continue;
 if(i%3===0){sphere(.3+random()*.9,x,.3,z,['#a8a591','#b8b09a','#969987'][i%3],[1.5,.8,1.1],1);}
 else {const size=.3+random()*.55;sphere(size,x,size*.42,z,['#7d8760','#93936c','#687b5a'][i%3],[1.4,.65,1],0);for(let j=0;j<3;j++){const stem=box(.035,.6+random()*.3,.035,x+random()*.5,.35,z+random()*.5,'#969262');stem.rotation.z=random()*.45;}}
 }
 for(let i=0;i<14;i++)sphere(5+random()*6,5+random()*55,1,-48-random()*20,'#a0ad93',[2,.6,1],1);
 // Stepping stones lead toward the open doorway.
 for(let i=0;i<9;i++){const stone=box(1.15,.055,.7,.1+Math.sin(i)*.2,.035,3.2+i*1.1,'#c4b99c');stone.rotation.y=Math.sin(i*2)*.16;}
 const plaster='#e0d8bb',trim='#507c70',wood='#886b4e',floor='#ba8f69';
 // House footprint: x -5..5, z -8..2. Door and internal openings are real gaps.
 box(10.4,.14,10.4,0,-.02,-3,'#baac8d');
 box(10,.04,10,0,.07,-3,floor);
 for(let x=-4.5;x<5;x+=1)box(.014,.01,10,x,.096,-3,'#9e785c');
 for(let z=-7.5;z<2;z+=1)box(10,.01,.014,0,.096,z,'#9e785c');
 function wall(w,h,d,x,y,z){return box(w,h,d,x,y,z,plaster,true);}
 wall(4,3.1,.25,-3,1.55,2);wall(4,3.1,.25,3,1.55,2);box(2, .65,.25,0,2.775,2,plaster);
 wall(10,3.1,.25,0,1.55,-8);
 // Side walls built around open windows.
 for(const x of [-5,5]){
 wall(.25,3.1,2.6,x,1.55,.7);wall(.25,3.1,3.5,x,1.55,-6.25);wall(.25,1.0,3.4,x,.5,-2.3);box(.25,.7,3.4,x,2.75,-2.3,plaster);
 box(.36,.09,3.5,x,1.06,-2.3,'#e7e1c9');
 for(const z of [-4,-.6])box(.32,1.38,.07,x,1.75,z,trim);
 box(.32,.07,3.4,x,2.44,-2.3,trim);box(.1,1.4,.055,x,1.75,-2.3,trim);
 }
 // Interior division: rear bedrooms and a front kitchen/living area.
 wall(.15,3.0,3,0,1.5,-6.5);wall(.15,3.0,1.5,0,1.5,-3.25);box(.15,.6,4,0,2.7,-2,plaster);
 wall(2.0,3,.15,-4,1.5,-4.5);wall(1.1,3,.15,-.55,1.5,-4.5);box(1.9,.6,.15,-2.05,2.7,-4.5,plaster);
 wall(1.2,3,.15,.6,1.5,-4.5);wall(2,3,.15,4,1.5,-4.5);box(1.8,.6,.15,2.1,2.7,-4.5,plaster);
 // Plastered gable ends close the roof above the front and rear walls.
 for(const z of [2,-8]){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([-5,3.1,z,5,3.1,z,0,4.45,z],3));geometry.computeVertexNormals();const gable=new THREE.Mesh(geometry,mat(plaster,{side:THREE.DoubleSide}));gable.castShadow=true;gable.receiveShadow=true;scene.add(gable);}
 // Beams and the terracotta roof, left open underneath.
 for(const z of [-7.8,-4,1.8])box(10,.17,.15,0,2.98,z,'#795e43');
 const roofGeometry=new THREE.BufferGeometry();roofGeometry.setAttribute('position',new THREE.Float32BufferAttribute([-5.7,3.12,2.7,0,4.65,2.7,0,4.65,-8.7,-5.7,3.12,2.7,0,4.65,-8.7,-5.7,3.12,-8.7,0,4.65,2.7,5.7,3.12,2.7,5.7,3.12,-8.7,0,4.65,2.7,5.7,3.12,-8.7,0,4.65,-8.7],3));roofGeometry.computeVertexNormals();const roof=new THREE.Mesh(roofGeometry,mat('#ac7253',{side:THREE.DoubleSide}));roof.castShadow=true;roof.receiveShadow=true;scene.add(roof);
 for(let z=-8.6;z<2.7;z+=.35){for(const side of [-1,1]){const beam=box(5.9,.065,.09,side*2.84,3.9,z,'#b97d59');beam.rotation.z=-side*.262;}}
 box(.6,1.6,.7,3.5,4.25,-5.8,'#d3c5a6');box(.85,.12,.95,3.5,5.08,-5.8,'#a76b4c');
 // Doorframe, blue shutters, porch and small signs of daily life.
 for(const x of [-1.03,1.03])box(.13,2.5,.33,x,1.25,2.05,trim);box(2.2,.12,.33,0,2.47,2.05,trim);
 const door=box(.12,2.35,1.7,-1.1,1.2,1.12,trim);door.rotation.y=-.1;
 textPlane('casa futtano',1.15,.32,1.9,1.7,2.145,'#dfd8ba','#52685a',37);
 for(const x of [-3.2,3.2]){box(1.1,1.35,.06,x,1.75,2.16,trim);for(let y=1.15;y<2.4;y+=.12)box(1.02,.035,.08,x,y,2.21,'#719384');}
 box(4,.1,2.1,0,.05,2.9,'#d5c8a8');
 const pot=cylinder(.32,.23,.5,2.6,.3,3.1,'#b27452');sphere(.48,2.6,.72,3.1,'#73825a',[1,.75,1]);
 box(.85,.025,.48,.1,.12,1.5,'#877b58');
 // Living room: linen sofa, rug, table, books, CRT workstation.
 box(2.25,.55,.85,-3.55,.45,.9,'#a2a58b',true);box(2.25,.55,.18,-3.55,.91,1.25,'#a2a58b');
 for(const x of [-4.6,-2.5])box(.18,.68,.85,x,.64,.9,'#92977c');
 for(const x of [-4,-3.15])box(.76,.14,.66,x,.79,.82,'#c8c4a7');
 const cushion=box(.5,.4,.16,-4.05,1.05,1.05,'#be885c');cushion.rotation.z=-.2;
 box(2.65,.015,2,-3.0,.112,-.5,'#b4aa86');for(let x=-4.25;x<-1.6;x+=.18)box(.035,.018,2,x,.12,-.5,'#ddceb0');
 box(1.25,.12,.65,-3.05,.53,-.6,wood,true);for(const x of [-3.55,-2.55])for(const z of [-.8,-.4])box(.07,.48,.07,x,.27,z,wood);
 box(.35,.06,.26,-3,.635,-.65,'#637d80');box(.31,.04,.24,-3.08,.69,-.62,'#d6ba87');cylinder(.07,.06,.13,-2.7,.68,-.5,'#eee2c5');
 // Desk and computer, facing the room (+z).
 box(2.25,.13,.86,-3.2,.86,-3.55,wood,true);for(const x of [-4.16,-2.24])for(const z of [-3.88,-3.22])box(.08,.84,.08,x,.43,z,wood);
 box(.64,.07,.4,-3.2,.985,-3.55,'#c7c4ac');box(.19,.17,.18,-3.2,1.07,-3.6,'#b4b3a0');
 box(.91,.69,.66,-3.2,1.46,-3.63,'#cac7b0');box(.81,.58,.04,-3.2,1.49,-3.282,'#aaa994');
 const pcScreen=textPlane('futtano.net\nclick to come in',.69,.46,-3.2,1.5,-3.254,'#255a60','#d8e9c4',38);
 const glow=new THREE.PointLight('#7bd6c9',1.8,2.8);glow.position.set(-3.2,1.5,-3.1);scene.add(glow);
 sphere(.022,-2.87,1.195,-3.275,'#99b96b');box(.83,.055,.28,-3.2,.97,-3.08,'#ccc9b4');
 for(let r=0;r<4;r++)for(let c=0;c<12;c++)box(.044,.016,.035,-3.55+c*.061,1.01,-3.18+r*.053,'#a8a99a');
 sphere(.09,-2.52,.98,-3.07,'#c6c3ad',[.7,.35,1.1],1);box(.32,.016,.32,-2.5,.939,-3.08,'#60756e');
 box(.35,.67,.64,-4.04,1.27,-3.52,'#c5c3ae');box(.27,.045,.015,-4.04,1.41,-3.191,'#686b61');box(.23,.022,.015,-4.04,1.56,-3.191,'#77796c');
 box(.58,.1,.55,-3.2,.55,-2.65,'#64796e');box(.58,.53,.1,-3.2,.9,-2.39,'#64796e');for(const x of [-3.43,-2.97])for(const z of [-2.86,-2.45])box(.035,.5,.035,x,.27,z,'#6e6e5d');
 // Wall clock and a bookshelf against the back living-room wall.
 textPlane('S A R D E G N A\nestate, senza fretta',1.25,.9,-4,2.08,-4.405,'#b7c9b4','#526c62',28);
 box(.6,1.8,.4,-.55,.98,-3.8,wood,true);for(let y=.4;y<1.9;y+=.45){box(.65,.05,.42,-.55,y,-3.8,'#ab8a62');for(let j=0;j<5;j++)box(.07,.26+random()*.09,.22,-.79+j*.105,y+.18,-3.78,['#8e5e48','#d2bd88','#638077'][j%3]);}
 // Kitchen: cabinets, sink, cooker, hanging shelf, breakfast table.
 box(.8,.9,3.0,4.45,.55,-2.55,'#80968b',true);box(.91,.09,3.12,4.42,1.035,-2.55,'#e0d6bb');
 for(const z of [-3.55,-2.55,-1.55]){box(.025,.63,.83,4.035,.58,z,'#a0afa0');box(.07,.045,.19,3.997,.8,z,'#535f56');}
 box(.58,.028,.7,4.4,1.095,-3.35,'#828f89');box(.43,.03,.55,4.4,1.113,-3.35,'#617c77');cylinder(.024,.024,.27,4.66,1.24,-3.35,'#b5b9a8');
 box(.61,.025,.62,4.4,1.095,-1.7,'#d6d1b8');for(const x of [4.24,4.56])for(const z of [-1.55,-1.86])cylinder(.11,.11,.018,x,1.122,z,'#50594e');
 cylinder(.14,.13,.17,4.4,1.2,-1.7,'#9d7954');
 box(.43,.08,2,4.72,2.13,-2.3,wood);for(let i=0;i<5;i++)cylinder(.08,.08,.21,4.66,2.27,-3+i*.33,['#ece2c7','#b38c5e'][i%2]);
 box(1,.93,.65,3.6,.56,-7.45,'#dedcc6',true); // bedroom dresser
 box(.73,1.78,.72,4.42,.97,.85,'#d7d8c4',true);box(.04,.3,.045,4.02,1.25,1.02,'#6f8174');
 cylinder(.63,.63,.1,2.15,.86,-1.2,'#b99466');for(const x of [1.8,2.5])for(const z of [-1.5,-.9])box(.07,.79,.07,x,.44,z,wood);
 cylinder(.2,.2,.025,2.13,.929,-1.2,'#e5dcc0');sphere(.07,2.11,.99,-1.2,'#b5a350');cylinder(.06,.05,.12,2.4,.98,-1.1,'#faf0d9');
 for(const z of [-2.15,-.25]){box(.5,.1,.45,2.15,.51,z,wood,true);box(.5,.48,.07,2.15,.79,z+(z<-1?-.2:.2),wood);for(const x of [1.96,2.34])box(.06,.45,.06,x,.27,z,wood);}
 // Bedroom: rumpled cotton, bedside lamp, a book left open, woven mat.
 box(1.85,.35,2.3,2.2,.33,-6.35,wood,true);box(1.88,.27,2.28,2.2,.62,-6.35,'#e8dfc4');box(1.91,.1,1.55,2.2,.81,-5.98,'#94aa9a');box(1.93,.045,.33,2.2,.87,-5.8,'#b9c7ae');
 for(const x of [1.75,2.62])box(.7,.17,.46,x,.87,-7.1,'#f0e7ce');box(1.95,.85,.12,2.2,.7,-7.53,'#917456');
 box(.57,.58,.54,.62,.4,-7.1,wood,true);box(.24,.04,.21,.62,.72,-7.1,'#966146');cylinder(.055,.08,.34,.62,.92,-7.18,'#7b6a4d');cylinder(.2,.3,.3,.62,1.17,-7.18,'#eadcb0');
 box(1.2,.02,1.8,3.95,.12,-5.9,'#c3b389');
 textPlane('the sea\ncan wait',.75,.85,2.2,1.92,-7.86,'#d1d2b4','#668079',42);
 // The back-left room: a quiet studio with boxes, a chair, and an open notebook.
 box(2,.12,.8,-3.2,.84,-7.2,wood,true);for(const x of [-4,-2.4])box(.08,.8,.6,x,.42,-7.2,wood);
 box(.5,.025,.34,-3.25,.925,-7.1,'#e5dec5');box(.015,.027,.34,-3.25,.93,-7.1,'#ae9c7e');
 for(let i=0;i<3;i++)box(.65,.45,.55,-4.35,.34+i*.44,-5.25,['#baab87','#a89978','#c5b18e'][i]);
 textPlane('STUDIO',.52,.18,-2.05,2.8,-4.399,'#e0d8bb','#6a765c',35);
 textPlane('BEDROOM',.65,.18,2.1,2.8,-4.399,'#e0d8bb','#6a765c',35);
 // A towel on a line outside and a low fence frame the path.
 for(const x of [7,11])cylinder(.035,.035,2,x,1,-6,'#796d51');box(4,.025,.025,9,1.9,-6,'#938d71');box(.85,1.0,.025,8.2,1.37,-6,'#ddd3b4');box(.65,.75,.025,9.7,1.48,-6,'#8b9b85');
 for(let z=5;z<16;z+=2){cylinder(.055,.06,.8,6,.4,z,'#998b66');}box(.045,.06,10,6,.64,10,'#ac9c78');
 const keys=new Set();let active=false,yaw=0,pitch=0,near=false,dragging=false,lastX=0,lastY=0,downX=0,downY=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function clearInput(){keys.clear();dragging=false;}
 function lookAt(x,y,z){camera.lookAt(x,y,z);yaw=camera.rotation.y;pitch=camera.rotation.x;}
 camera.position.set(18,5.5,22);lookAt(-1,1.1,-1.6);
 function visit(place){clearInput();const places={shore:[.1,1.65,12,.0,1.65,0],living:[-1.8,1.65,-1.6,-3.2,1.45,-3.5],kitchen:[1.25,1.65,.75,4.3,1.25,-2.3],bedroom:[1.0,1.65,-5.05,2.2,.9,-6.7]};const p=places[place]??places.shore;camera.position.set(...p.slice(0,3));lookAt(...p.slice(3));}
 function setActive(value){active=value;clearInput();if(active)renderer.domElement.focus({preventScroll:true});if(!active){near=false;onNearComputer(false);}}
 function collision(x,z){if(x<-13||x>22||z>23||z<-20)return true;const r=.23;return colliders.some(c=>x>c.minX-r&&x<c.maxX+r&&z>c.minZ-r&&z<c.maxZ+r);}
 const movementKeys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
 window.addEventListener('keydown',e=>{if(!active||e.target.closest('button,a,input,textarea,dialog'))return;if(movementKeys.includes(e.code)){e.preventDefault();keys.add(e.code);}if(e.code==='KeyE'&&near){e.preventDefault();onComputer();}});
 window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',clearInput);
 const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute("aria-label","Explore the house: WASD to walk, drag to look, E for computer");
 canvas.addEventListener('pointerdown',e=>{if(!active)return;dragging=true;lastX=downX=e.clientX;lastY=downY=e.clientY;canvas.setPointerCapture(e.pointerId);document.activeElement?.blur();});
 canvas.addEventListener('pointermove',e=>{if(!dragging||!active)return;yaw-=(e.clientX-lastX)*.003;pitch-=(e.clientY-lastY)*.003;pitch=THREE.MathUtils.clamp(pitch,-1.25,1.25);lastX=e.clientX;lastY=e.clientY;});
 canvas.addEventListener('pointerup',e=>{
  dragging=false;
  if(!active||!near||Math.hypot(e.clientX-downX,e.clientY-downY)>6)return;
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1),camera);
  if(ray.intersectObject(pcScreen).length)onComputer();
 });canvas.addEventListener('pointercancel',()=>dragging=false);
 document.querySelectorAll('[data-move]').forEach(b=>{const code={forward:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD'}[b.dataset.move];b.addEventListener('pointerdown',e=>{if(!active)return;e.preventDefault();keys.add(code);b.setPointerCapture(e.pointerId);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(code));});
 let last=0,elapsed=0,lastLocation='';
 const pcPosition=new THREE.Vector3(-3.2,1.5,-3.25);
 renderer.setAnimationLoop(now=>{
 const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;
 elapsed+=dt;
 if(!reduced.matches){waves.forEach((w,i)=>{w.position.x=-17-i*2+Math.sin(elapsed*.25+i)*.35;w.material.opacity=.20+Math.sin(elapsed*.7+i)*.04;});}
 if(active){
 let forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);
 let right=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);
 const length=Math.hypot(forward,right)||1;forward/=length;right/=length;
 const speed=2.65*dt;const dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*right)*speed;const dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*right)*speed;
 if(!collision(camera.position.x+dx,camera.position.z))camera.position.x+=dx;
 if(!collision(camera.position.x,camera.position.z+dz))camera.position.z+=dz;
 camera.rotation.set(pitch,yaw,0);
 const inside=camera.position.x>-5&&camera.position.x<5&&camera.position.z<2&&camera.position.z>-8;
 const label=inside?(camera.position.z<-4.5?(camera.position.x>0?'THE BEDROOM':'THE STUDIO'):(camera.position.x>0?'THE KITCHEN':'THE LIVING ROOM')):'THE SHORE';
 if(label!==lastLocation){lastLocation=label;onLocation(label);}
 const close=inside&&camera.position.x<0&&camera.position.z>-4.4&&camera.position.distanceTo(pcPosition)<2.5;
 if(close!==near){near=close;onNearComputer(near);}
 }
 renderer.render(scene,camera);
 });
 window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);setActive(false);onFailure();});
 return {setActive,visit};
}
