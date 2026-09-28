import './style.css';
import { marked } from 'marked';
import beginning from '../content/beginning.md?raw';
import making from '../content/making.md?raw';
import reading from '../content/reading.md?raw';
const $ = s => document.querySelector(s);
const entries = [
 {id:'beginning', title:'A small place on the internet',category:'Thoughts',summary:'A room of your own, somewhere on the web.',body:beginning},
 {id:'making',title:'Making room for play',category:'Making',summary:'Building a place you can get a little lost in.',body:making},
 {id:'reading',title:'What stays after the last page',category:'Reading',summary:'A few questions to keep in the margins.',body:reading}
];
let world, exploring = false, transitioning = false;
const desktop = $('#desktop');
function setTab(tab='journal', article) {
 const content = $('#page-content');
 document.querySelectorAll('[data-tab]').forEach(b=>{if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 $('#address-tab').textContent=article?`journal/${article.id}`:tab;
 const heading = '<p class="web-eyebrow">A personal homepage, by futtano</p>';
 if(article) content.innerHTML=`<button class="back-journal">← Back to the journal</button><p class="web-eyebrow">${article.category} · sample entry</p>${marked.parse(article.body)}`;
 else if(tab==='journal') content.innerHTML=`${heading}<h1>Hello, you found me.</h1><p>Welcome to the quiet part of the internet. A few thoughts, things I’m making, and notes from whatever I’m reading.</p><p class="sample-note">The house is taking shape. These first entries are sample text, waiting for my own words.</p>${entries.map(e=>`<a class="entry" href="#note-${e.id}"><span class="entry-meta">${e.category.toUpperCase()} / SAMPLE NOTE</span><strong>${e.title} ↗</strong><p>${e.summary}</p></a>`).join('')}`;
 else if(tab==='work') content.innerHTML=`${heading}<h1>Things I’m making.</h1><h2>01. A house by the sea</h2><p>This website: an imagined Sardinian beach, a quiet house, and a computer with a personal website inside it. A small experiment with memory, places, and the web.</p><p>Built with Three.js, simple geometry, and a soft spot for the internet of the late ’90s.</p><p><a href="https://github.com/Futtano" target="_blank" rel="noopener noreferrer">Find me on GitHub ↗</a></p>`;
 else if(tab==='reading') content.innerHTML=`${heading}<h1>On the bedside table.</h1><p>A place for books, essays, and the ideas that linger. The reading list is still waiting to be filled.</p><a class="entry" href="#note-reading"><span class="entry-meta">SAMPLE READING NOTE</span><strong>What stays after the last page ↗</strong><p>Three questions to ask a book.</p></a>`;
 else content.innerHTML=`${heading}<h1>I’m futtano.</h1><p>This is my little house on the internet. Somewhere to leave my work, opinions, reading notes, and unfinished thoughts.</p><p>The setting is an imagined corner of Sardinia. The computer belongs to the years around when I was born: the late ’90s and early 2000s.</p><p>There’s more to add here. For now, make yourself at home.</p><p><a href="https://github.com/Futtano" target="_blank" rel="noopener noreferrer">github.com/Futtano ↗</a></p>`;
 content.querySelector('.back-journal')?.addEventListener('click',()=>location.hash='journal');
 $('.browser-page').scrollTop=0;
 document.title=article?`${article.title} — futtano`:'futtano — a house by the sea';
}
function openDesktop(tab='journal',article) { world?.setActive(false); if(!desktop.open)desktop.showModal();setTab(tab,article); }
function route() { const hash=location.hash.slice(1);const article=entries.find(e=>hash===`note-${e.id}`);if(article)openDesktop('journal',article);else if(['journal','work','reading','about'].includes(hash))openDesktop(hash);else {desktop.close();world?.setActive(exploring);document.title='futtano — a house by the sea';} }
function closeDesktop(){history.replaceState(null,'',location.pathname+location.search);desktop.close();world?.setActive(exploring);document.title='futtano — a house by the sea';}
$('#read-direct').addEventListener('click',()=>location.hash='journal');
$('#skip-to-pc').addEventListener('click',()=>location.hash='journal');
$('#close-desktop').addEventListener('click',closeDesktop);$('#return-world').addEventListener('click',closeDesktop);
desktop.addEventListener('cancel',e=>{e.preventDefault();closeDesktop();});
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>location.hash=b.dataset.tab));
$('#start-menu').addEventListener('click',()=>location.hash='journal');
window.addEventListener('hashchange',route);route();
async function enter(place='shore') {
 if(!world||transitioning)return;transitioning=true;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 $('#dream').classList.add('active');
 await new Promise(r=>setTimeout(r,reduced?0:950));
 exploring=true;document.body.classList.add('exploring');$('#arrival').hidden=true;$('#hud').hidden=false;
 world.visit(place);world.setActive(!desktop.open);$('#dream').classList.remove('active');transitioning=false;
 $('#world-status').textContent='STAY A WHILE. THE REST CAN WAIT.';
}
$('#enter').addEventListener('click',()=>enter());
$('#help').addEventListener('click',()=>{world?.setActive(false);$('#guide').showModal();});
function closeGuide(){ $('#guide').close();world?.setActive(exploring&&!desktop.open); }
$('.close-guide').addEventListener('click',closeGuide);
$('#guide').addEventListener('cancel',e=>{e.preventDefault();closeGuide();});
document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>{closeGuide();enter(b.dataset.place);}));
$('#interact').addEventListener('click',()=>location.hash='journal');
let sound;
$('#sound').addEventListener('click',async()=>{
 try {
 if(!sound){const context=new AudioContext();const buffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate);const values=buffer.getChannelData(0);let last=0;for(let i=0;i<values.length;i++){last=(last+Math.random()*.04-.02)/1.02;values[i]=last*3;}const source=context.createBufferSource();source.buffer=buffer;source.loop=true;const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=450;const gain=context.createGain();gain.gain.value=.25;source.connect(filter).connect(gain).connect(context.destination);source.start();sound=context;} else if(sound.state==='running')await sound.suspend();else await sound.resume();
 const on=sound.state==='running';$('#sound').textContent=on?'Sound on':'Sound off';$('#sound').setAttribute('aria-pressed',String(on));
 }catch{$('#sound').textContent='Sound unavailable';}
});
import('./scene.js').then(({initWorld})=>{
 world=initWorld({onComputer:()=>location.hash='journal',onLocation:name=>$('#location').textContent=name,onNearComputer:near=>$('#interact').hidden=!near,onFailure:unavailable});
 $('#enter').disabled=false;$('#enter').innerHTML='Find your way in <span>↗</span>';
}).catch(unavailable);
function unavailable(){world?.setActive(false);$('#enter').hidden=true;$('#world-status').textContent='THE 3D WORLD IS UNAVAILABLE. THE WRITING IS STILL HERE.';$('#arrival').hidden=false;$('#hud').hidden=true;$('#arrival-title').innerHTML='A place<br>to <em>stay.</em>';document.querySelector('.arrival-copy').textContent='This browser cannot display the 3D house. You can still visit futtano’s computer and read everything.';}
