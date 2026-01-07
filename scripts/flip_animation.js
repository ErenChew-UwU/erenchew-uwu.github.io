const world3d = document.getElementById('world-3d');
const mirrorIframe = document.getElementById('mirror-iframe');
const flipMask = document.getElementById('flip-mask');
const flipBtn = document.getElementById('flip-btn');
const target = window.nextPage;

let isFlipping = false;

//反转动画
flipBtn.addEventListener('click', () => {
    if(isFlipping) return;
    isFlipping = true;
    flipBtn.style.opacity = 0;
    const windowHeight = window.innerHeight;

    try {
        startBg();
    } catch(e) {
        console.warn("Background animation not loaded:", e);
    }

    // 让 iframe 在旋转途中可见
    mirrorIframe.style.opacity = 1;

    // 开始动画：旋转 180° + 放大 + 退后 + 遮罩
    world3d.style.transform = `translateZ(-2000px) translateY(-${windowHeight}px) rotateZ(180deg) scale(1.05)`;
    flipMask.style.background = 'rgba(255,50,50,0.2)';

    // 动画结束后固定视角
    setTimeout(()=>{
        world3d.style.transform = 'translateZ(0) rotateZ(180deg) scale(1)';
        flipMask.style.background = 'rgba(255,50,50,0)';
        isFlipping=false;
    }, 2500);

    // 动画结束后正式跳转
    setTimeout(()=> {
        try {
            stopBg();
        } catch(e) {
            console.warn("Background animation failed to stop:", e);
        }
        window.location.href = target;
    }, 5000);
});