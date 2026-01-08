/**
 * Index 页面交互逻辑
 * 包含：计数器、颜色切换、成就检测、气泡提示、鼠标跟随特效
 */

document.addEventListener('DOMContentLoaded', () => {
    // === 鼠标跟随光晕特效 ===
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 使用 requestAnimationFrame 实现平滑跟随
    function animateGlow() {
        // 简单的线性插值 (Lerp) 使跟随更平滑
        const ease = 0.1;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;

        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;

        requestAnimationFrame(animateGlow);
    }
    animateGlow();


    // === 核心业务逻辑 ===
    const btn = document.getElementById('changeColorBtn');

    // 如果不在 index 页面（没有按钮），则不执行以下逻辑
    if (!btn) return;

    const body = document.body;
    const message = document.querySelector('.message');
    const counter = document.getElementById('counter');

    // 从 localStorage 读取次数
    let count = parseInt(localStorage.getItem('clickCount')) || 0;
    let isAchievementUnlocked = false;

    // 初始化页面显示
    counter.textContent = `点击次数：${count}`;

    // 检查加载时是否已经达成成就
    if (count >= 10) {
        isAchievementUnlocked = true;
        message.textContent = '你太棒了！达成 10 次点击成就！';
        body.style.backgroundColor = '#FFD700';
    }

    // 生成随机颜色
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // 显示气泡提示
    function showToast(text) {
        console.log('气泡触发了');

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = text;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        }, 3000);
    }

    // 点击事件
    btn.addEventListener('click', () => {
        count++;
        localStorage.setItem('clickCount', count);
        counter.textContent = `点击次数：${count}`;

        // 10的倍数触发气泡
        if (count > 0 && count % 10 === 0) {
            showToast(`成就达成：点击 ${count} 次！`);

            if (count === 10 && !isAchievementUnlocked) {
                isAchievementUnlocked = true;
                message.textContent = '你太棒了！达成 10 次点击成就！';
                body.style.backgroundColor = '#FFD700';
            }
        }

        if (count === 10) return;
        if (isAchievementUnlocked) return;

        // 随机变色
        const newColor = getRandomColor();
        body.style.backgroundColor = newColor;
    });
});
