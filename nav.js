/**
 * 通用导航栏组件
 * 
 * 功能：
 * 1. 动态生成首页和统计页的导航链接
 * 2. 自动插入到页面顶部
 * 3. 包含基础的 CSS 样式
 */

/**
 * 通用导航栏组件
 * 
 * 功能：
 * 1. 动态生成首页和统计页的导航链接
 * 2. 自动插入到页面顶部
 * 3. 包含基础的 CSS 样式
 */

// 将逻辑封装在 initNav 函数中，供主程序调用
window.initNav = function () {
    // 创建 nav 元素
    const nav = document.createElement('nav');

    // 设置导航栏样式
    nav.style.position = 'fixed';
    nav.style.top = '0';
    nav.style.left = '0';
    nav.style.width = '100%';
    nav.style.backgroundColor = 'var(--glass-bg)'; // Use CSS Variable
    nav.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    nav.style.display = 'flex';
    nav.style.justifyContent = 'center';
    nav.style.alignItems = 'center';
    nav.style.padding = '1rem 0';
    nav.style.zIndex = '1000';
    nav.style.backdropFilter = 'blur(10px)';
    nav.style.borderBottom = '1px solid var(--glass-border)';

    // 定义导航链接样式
    const linkStyle = `
        text-decoration: none;
        color: var(--text-muted);
        font-weight: 500;
        margin: 0 1.5rem;
        font-size: 1rem;
        transition: color 0.2s ease;
    `;

    // 构建导航内容
    nav.innerHTML = `
        <div style="font-weight:bold; font-size:1.2rem; color:var(--accent-color); margin-right:auto; padding-left:2rem;">⚓ MindAnchor</div>
        <a href="index.html" style="${linkStyle}" onmouseover="this.style.color='var(--accent-color)'" onmouseout="this.style.color='var(--text-muted)'" data-i18n="navHome">首页</a>
        <a href="stats.html" style="${linkStyle}" onmouseover="this.style.color='var(--accent-color)'" onmouseout="this.style.color='var(--text-muted)'" data-i18n="navStats">成就统计</a>
    `;

    // 容器用于放置按钮
    const btnContainer = document.createElement('div');
    btnContainer.style.marginLeft = '2rem';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '10px';

    // 1. 语言切换按钮
    const langBtn = document.createElement('button');
    langBtn.id = 'langToggle';
    langBtn.textContent = '中/EN';
    langBtn.className = 'nav-btn'; // Use class for shared styles

    // 2. 换肤按钮
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.textContent = '🎨 Theme';
    themeBtn.className = 'nav-btn';

    // 共享样式注入 (因为 nav.js 是独立的)
    const style = document.createElement('style');
    style.textContent = `
        .nav-btn {
            padding: 0.5rem 1rem;
            border: 1px solid var(--accent-color);
            background: transparent;
            color: var(--accent-color);
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        .nav-btn:hover {
            background: var(--accent-color);
            color: white;
        }
    `;
    document.head.appendChild(style);

    btnContainer.appendChild(langBtn);
    btnContainer.appendChild(themeBtn);
    nav.appendChild(btnContainer);

    // 将导航栏插入到 body 的最前面
    document.body.insertBefore(nav, document.body.firstChild);

    // 为了防止导航栏遮挡内容，给 body 添加顶部内边距
    document.body.style.paddingTop = '80px';
};
