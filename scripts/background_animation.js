// --- 初始化数学公式 ---
const mathFormulas = document.getElementById('math-formulas');
const mathSymbols = ["{","}","[","]","(",")","<",">","==","+","-","*","/","%","lambda","def","fn","var","let","const","if","else"];
const formulas = [];
const formulaCount = window.innerWidth < 768 ? 100 : 200;

let bgAnimationId = null;
let bgAnimating = false;

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    for(let i=0;i<formulaCount;i++){
        const f = document.createElement('div');
        f.className='math-formula';
        f.textContent=mathSymbols[Math.floor(Math.random()*mathSymbols.length)];
        f.style.top = Math.random()*80+'%';
        f.style.left = Math.random()*80+'%';
        const size = 16 + Math.random()*24;
        f.style.fontSize = size+'px';
        const rotation = -30 + Math.random()*60;
        f.style.transform=`rotate(${rotation}deg)`;
        f.style.animationDelay = Math.random()*3+'s';
        mathFormulas.appendChild(f);
        formulas.push({el:f, x:f.offsetLeft, y:f.offsetTop, w:f.offsetWidth, h:f.offsetHeight, vx:(Math.random()*2+1)*(Math.random()<0.5?-1:1), vy:(Math.random()*2+1)*(Math.random()<0.5?-1:1), rotation});
    }
});

// 背景动画
function animateBg(){
    if(!bgAnimating) return;
    const w=window.innerWidth, h=window.innerHeight;
    formulas.forEach(f=>{
        f.x+=f.vx; 
        f.y+=f.vy;
        if(f.x<=0||f.x+f.w>=w) f.vx*=-1;
        if(f.y<=0||f.y+f.h>=h) f.vy*=-1;
        f.rotation+=0.2;
        f.el.style.left=f.x+'px';
        f.el.style.top=f.y+'px';
        f.el.style.transform=`rotate(${f.rotation}deg)`;
    });
    bgAnimationId = requestAnimationFrame(animateBg);
}

function startBg(){
    if(bgAnimating) return;
    bgAnimating = true;
    animateBg();
}

function stopBg(){
    bgAnimating = false;
    if(bgAnimationId) cancelAnimationFrame(bgAnimationId);
}

