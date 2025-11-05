// ====== Particle background ======
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w, h, particles;
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  createParticles();
}
function createParticles(){
  const count = Math.min(140, Math.floor((w*h)/22000));
  particles = [...Array(count)].map(()=> ({
    x: Math.random()*w,
    y: Math.random()*h,
    vx:(Math.random()-.5)*0.4,
    vy:(Math.random()-.5)*0.4,
    r: Math.random()*1.5+0.3
  }));
}
function update(){
  ctx.clearRect(0,0,w,h);
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>w) p.vx*=-1;
    if(p.y<0||p.y>h) p.vy*=-1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="rgba(0,255,198,0.35)";
    ctx.fill();
  }
  // connecting lines
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const dx=a.x-b.x, dy=a.y-b.y, dist= Math.hypot(dx,dy);
      if(dist<90){
        ctx.strokeStyle=`rgba(255,255,255,${(1-dist/90)*0.08})`;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  requestAnimationFrame(update);
}
window.addEventListener('resize', resize);
resize(); requestAnimationFrame(update);

// ====== Typewriter ======
const typer = document.querySelector('.type');
const fullText = typer.textContent;
typer.textContent = "";
let i=0;
(function typeLoop(){
  typer.textContent = fullText.slice(0, i++);
  if(i<=fullText.length){ setTimeout(typeLoop, 18); }
})();

// ====== Counters ======
let people=0, impact=0;
function easeOutQuad(t){ return t*(2-t); }
(function countUp(){
  const dur=1800, start=performance.now();
  const targetPeople = 20, targetImpact = 20*52; // Beispiel
  function frame(now){
    const p = Math.min(1,(now-start)/dur);
    const e = easeOutQuad(p);
    document.getElementById('peopleCounter').textContent = Math.floor(targetPeople*e);
    document.getElementById('impactCounter').textContent = Math.floor(targetImpact*e);
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ====== Reveal on scroll ======
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// ====== Magnetic buttons ======
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.08}px, ${y*0.08}px)`;
  });
  btn.addEventListener('mouseleave', ()=> btn.style.transform = '');
});

// ====== Simple confetti ======
function shootConfetti(x, y){
  const n=80, colors=['#00ffc6','#80ffe7','#ffd166','#ffffff'];
  for(let i=0;i<n;i++){
    const div=document.createElement('div');
    div.className='conf'; div.style.position='fixed'; div.style.left=x+'px'; div.style.top=y+'px';
    const size = Math.random()*6+4;
    div.style.width=div.style.height=size+'px';
    div.style.background=colors[Math.floor(Math.random()*colors.length)];
    div.style.borderRadius='2px';
    div.style.pointerEvents='none';
    document.body.appendChild(div);
    const ang=Math.random()*Math.PI*2, sp= Math.random()*6+3;
    const vx=Math.cos(ang)*sp, vy=Math.sin(ang)*sp-6;
    let life=0;
    (function anim(){
      life+=0.016;
      const nx = x + vx*life*60;
      const ny = y + (vy*life*60) + 0.5*900*life*life*0.016;
      div.style.transform=`translate(${nx-x}px,${ny-y}px) rotate(${life*800}deg)`;
      div.style.opacity = 1 - life/1.2;
      if(life<1.2) requestAnimationFrame(anim); else div.remove();
    })();
  }
}
document.querySelectorAll('.confetti').forEach(b=> b.addEventListener('click', e=>{
  const r = b.getBoundingClientRect();
  shootConfetti(r.left + r.width/2, r.top + 10);
}));

// ====== Pledge list (local only) ======
const form = document.getElementById('pledgeForm');
const list = document.getElementById('pledgeList');
const storageKey = 'pledges-v1';
function renderPledges(){
  const pledges = JSON.parse(localStorage.getItem(storageKey) || '[]');
  list.innerHTML = '';
  pledges.forEach(p=>{
    const li = document.createElement('li');
    li.textContent = (p.name? p.name+': ' : '') + p.action;
    list.appendChild(li);
  });
}
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const action = document.getElementById('action').value.trim();
  if(!action) return;
  const pledges = JSON.parse(localStorage.getItem(storageKey) || '[]');
  pledges.unshift({name, action, at: Date.now()});
  localStorage.setItem(storageKey, JSON.stringify(pledges));
  form.reset();
  renderPledges();
  shootConfetti(innerWidth/2, 80);
});
renderPledges();

// ====== Subtle 3D tilt via mouse ======
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width - .5;
    const y=(e.clientY-r.top)/r.height - .5;
    card.style.transform = `perspective(700px) rotateX(${y*-6}deg) rotateY(${x*6}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform='');
});
