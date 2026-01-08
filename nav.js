/**
 * 通用导航栏组件
 * 
 * 功能：
 * 1. 动态生成首页和统计页的导航链接
 * 2. 自动插入到页面顶部
 * 3. 包含基础的 CSS 样式
 */

document.addEventListener('DOMContentLoaded', () => {
    // 创建 nav 元素
    const nav = document.createElement('nav');

    // 设置导航栏样式
    nav.style.position = 'fixed';
    nav.style.top = '0';
    nav.style.left = '0';
    nav.style.width = '100%';
    nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    nav.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    nav.style.display = 'flex';
    nav.style.justifyContent = 'center';
    nav.style.alignItems = 'center';
    nav.style.padding = '1rem 0';
    nav.style.zIndex = '1000';
    nav.style.backdropFilter = 'blur(10px)'; // 毛玻璃效果，增加高级感

    // 定义导航链接样式
    const linkStyle = `
        text-decoration: none;
        color: #4b5563;
        font-weight: 500;
        margin: 0 1.5rem;
        font-size: 1rem;
        transition: color 0.2s ease;
    `;

    // 构建导航内容
    // 使用 innerHTML 插入链接
    nav.innerHTML = `
        <a href="index.html" style="${linkStyle}" onmouseover="this.style.color='#0288D1'" onmouseout="this.style.color='#4b5563'">首页</a>
        <a href="stats.html" style="${linkStyle}" onmouseover="this.style.color='#0288D1'" onmouseout="this.style.color='#4b5563'">成就统计</a>
    `;

    // 将导航栏插入到 body 的最前面
    document.body.insertBefore(nav, document.body.firstChild);

    // 为了防止导航栏遮挡内容，给 body 添加顶部内边距
    document.body.style.paddingTop = '60px';
});
