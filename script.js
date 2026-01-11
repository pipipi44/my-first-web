/**
 * Antigravity Web App - Core Script
 * Architecture: Object-Oriented (OOP)
 * Updated: 2026/01/11
 */

// === 1. State Management (状态管理) ===
// 集中管理应用的所有状态，避免散落在全局变量中
const AppState = {
    lang: localStorage.getItem('appLang') || 'zh',
    theme: localStorage.getItem('appTheme') || 'default',
    clickCount: parseInt(localStorage.getItem('clickCount')) || 0,
    moods: [], // 将在 init 中加载
    audioContext: null // Lazy init
};

// === 2. Themes Configuration (主题配置) ===
const Themes = {
    default: {
        '--main-bg': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        '--accent-color': '#0288D1',
        '--accent-hover': '#0277BD'
    },
    forest: {
        '--main-bg': 'linear-gradient(to right, #134e5e, #71b280)',
        '--accent-color': '#2e7d32',
        '--accent-hover': '#1b5e20'
    },
    ocean: {
        '--main-bg': 'linear-gradient(to right, #2193b0, #6dd5ed)',
        '--accent-color': '#00bcd4',
        '--accent-hover': '#0097a7'
    }
};

// === 3. I18N Dictionary (多语言字典) ===
const I18nData = {
    zh: {
        pageTitle: "我的第一个 Antigravity 项目",
        navHome: "首页",
        navStats: "成就统计",
        intro: "你好，我是正在使用 Antigravity 学习的前端开发者。",
        welcomeMessage: "我的第一个 Antigravity 项目",
        clickCount: "点击次数：",
        btnClick: "点击了解更多",
        moodTitle: "心情记事本",
        btnRecord: "记录",
        btnClear: "清空所有",
        btnExport: "导出日记",
        footerDisclaimerLabel: "免责声明：",
        footerPrivacyContent: "本应用仅用于个人心情记录，您的数据存储在浏览器本地。",
        footerCopyright: "© 2026 由 Antigravity 创作。",
        poweredBy: "由 Antigravity 强力驱动",
        placeholder: "写下此刻的心情...",
        confirmClear: "确定要删除所有心情记录吗？",
        toastAchievement: "成就达成：点击 %s 次！",
        toastEncourage: "你太棒了！达成 10 次点击成就！",
        toastDeleted: "记录已删除",
        statTotal: "总记录数",
        statWeek: "本周新增",
        statLast: "上次打卡",
        moodBalanceTitle: "情绪平衡指数",
        statusPositive: "元气满满!",
        statusNegative: "需要休息...",
        statusNeutral: "平静如水"
    },
    en: {
        pageTitle: "My First Antigravity Project",
        navHome: "Home",
        navStats: "Statistics",
        intro: "Hello, I am a future developer learning with Antigravity.",
        welcomeMessage: "My First Antigravity Project",
        clickCount: "Click Count: ",
        btnClick: "Click to Learn More",
        moodTitle: "Mood Notepad",
        btnRecord: "Record",
        btnClear: "Clear All",
        btnExport: "Export Diary",
        footerDisclaimerLabel: "Disclaimer:",
        footerPrivacyContent: "This app is for personal mood tracking only. Your data is stored locally in your browser.",
        footerCopyright: "© 2026 Created by Antigravity.",
        poweredBy: "Powered by Antigravity",
        placeholder: "Write down your mood...",
        confirmClear: "Are you sure you want to delete all mood records?",
        toastAchievement: "Achievement Unlocked: %s Clicks!",
        toastEncourage: "You are amazing! 10 Clicks Achievement!",
        toastDeleted: "Record Deleted",
        statTotal: "Total Records",
        statWeek: "This Week",
        statLast: "Last Active",
        moodBalanceTitle: "Mood Balance",
        statusPositive: "Full of Energy!",
        statusNegative: "Need a Break...",
        statusNeutral: "Calm & Neutral"
    }
};

// === 4. App Controller (核心应用对象) ===
const App = {
    // --- Lifecycle Methods ---
    init: function () {
        console.log("🚀 App initializing...");

        // 1. Load Data safely
        this.data.load();

        // 2. Initialize Modules
        this.ui.initTheme(); // Must act early to prevent flash
        this.modules.nav.init();
        this.modules.i18n.init();
        this.modules.stats.init();
        this.modules.mood.init();
        this.modules.cursor.init();
        this.modules.dashboard.update(); // Initial render

        // 3. Global Interactions
        this.bindGlobalEvents();

        console.log("✅ App initialized successfully.");
    },

    // --- Helpers ---
    bindGlobalEvents: function () {
        // Event Delegation for dynamic elements
        document.addEventListener('click', (e) => {
            // Language Toggle
            if (e.target.id === 'langToggle') {
                this.methods.toggleLanguage();
                this.audio.playClick();
            }
            // Theme Toggle
            if (e.target.id === 'themeToggle') {
                this.methods.toggleTheme();
                this.audio.playClick();
            }
        });

        // Initialize Web Audio on first user interaction
        document.addEventListener('click', () => {
            if (AppState.audioContext && AppState.audioContext.state === 'suspended') {
                AppState.audioContext.resume();
            }
        }, { once: true });
    },

    // --- Sub-Modules ---
    data: {
        load: function () {
            try {
                const storedMoods = localStorage.getItem('moods');
                AppState.moods = storedMoods ? JSON.parse(storedMoods) : [];
            } catch (e) {
                console.error("Data corruption detected. Resetting moods.", e);
                AppState.moods = [];
            }
        },
        saveMoods: function () {
            localStorage.setItem('moods', JSON.stringify(AppState.moods));
        }
    },

    modules: {
        nav: {
            init: function () {
                if (typeof window.initNav === 'function') window.initNav();
            }
        },

        i18n: {
            init: function () {
                App.methods.updateTexts();
            }
        },

        stats: {
            init: function () {
                const btn = document.getElementById('changeColorBtn');
                if (!btn) return;

                // Update click listener
                btn.addEventListener('click', () => {
                    AppState.clickCount++;
                    localStorage.setItem('clickCount', AppState.clickCount);
                    App.methods.updateTexts(); // Re-render counter text
                    App.audio.playClick();
                    App.ui.changeRandomBg();
                    App.modules.stats.checkAchievements();
                });
            },
            checkAchievements: function () {
                if (AppState.clickCount === 10) {
                    App.ui.showToast(I18nData[AppState.lang].toastEncourage);
                } else if (AppState.clickCount % 10 === 0) {
                    const msg = I18nData[AppState.lang].toastAchievement.replace('%s', AppState.clickCount);
                    App.ui.showToast(msg);
                }
            }
        },

        mood: {
            init: function () {
                const saveBtn = document.getElementById('saveMoodBtn');
                const clearBtn = document.getElementById('clearMoodsBtn');
                const exportBtn = document.getElementById('exportMoodBtn');
                const list = document.getElementById('timelineList');

                if (saveBtn) {
                    saveBtn.addEventListener('click', () => {
                        const input = document.getElementById('moodInput');
                        const text = input.value.trim();
                        if (!text) return;

                        const now = new Date();
                        const timestamp = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                        AppState.moods.unshift({ text, date: timestamp });
                        App.data.saveMoods();
                        input.value = '';

                        App.modules.mood.render();
                        App.modules.dashboard.update();
                        App.audio.playClick();
                    });
                }

                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        if (confirm(I18nData[AppState.lang].confirmClear)) {
                            AppState.moods = [];
                            App.data.saveMoods();
                            App.modules.mood.render();
                            App.modules.dashboard.update();
                            App.audio.playClick();
                        }
                    });
                }

                if (exportBtn) {
                    exportBtn.addEventListener('click', () => {
                        // Simple export logic
                        if (AppState.moods.length === 0) return;
                        let content = "=== Diary ===\n";
                        AppState.moods.forEach(m => content += `[${m.date}] ${m.text}\n`);
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = 'diary.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                    });
                }

                // Delete Delegation
                if (list) {
                    list.addEventListener('click', (e) => {
                        if (e.target.closest('.delete-item-btn')) {
                            const btn = e.target.closest('.delete-item-btn');
                            const index = parseInt(btn.getAttribute('data-index'));

                            // Visual removal
                            const item = btn.closest('.timeline-item');
                            item.classList.add('slide-out');

                            setTimeout(() => {
                                // Logic removal
                                AppState.moods.splice(index, 1);
                                App.data.saveMoods();
                                App.modules.mood.render();
                                App.modules.dashboard.update();
                                App.ui.showToast(I18nData[AppState.lang].toastDeleted);
                            }, 500);
                        }
                    });
                }

                this.render();
            },
            render: function () {
                const list = document.getElementById('timelineList');
                if (!list) return;
                list.innerHTML = '';
                AppState.moods.forEach((m, i) => {
                    const li = document.createElement('li');
                    li.className = 'timeline-item';
                    li.innerHTML = `
                       <div class="timeline-content">
                           <button class="delete-item-btn" data-index="${i}">×</button>
                           <span class="timeline-date">${m.date}</span>
                           <div class="timeline-text">${m.text}</div>
                       </div>
                   `;
                    list.appendChild(li);
                });
            }
        },

        dashboard: {
            update: function () {
                const moods = AppState.moods;
                const total = moods.length;

                // Weekly
                const now = new Date();
                const oneWeekAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
                const weekCount = moods.filter(m => new Date(m.date).getTime() >= oneWeekAgo).length;

                // Last Active
                const lastActive = moods.length > 0 ? moods[0].date.split(' ')[0] : '-';

                // Update DOM
                const elTotal = document.getElementById('statTotalValue');
                const elWeek = document.getElementById('statWeekValue');
                const elLast = document.getElementById('statLastValue');
                if (elTotal) elTotal.textContent = total;
                if (elWeek) elWeek.textContent = weekCount;
                if (elLast) elLast.textContent = lastActive;

                // Mood Balance Analysis
                this.updateBalance();
            },
            updateBalance: function () {
                const positive = ['happy', '开心', '棒', 'good', 'great', 'excellent', 'nice', 'cool', '爽', '赞'];
                const negative = ['sad', '难过', '累', 'bad', 'tired', 'angry', 'depressed', '烦', '丧', '苦'];

                let posCount = 0;
                let negCount = 0;

                AppState.moods.forEach(m => {
                    const t = m.text.toLowerCase();
                    if (positive.some(k => t.includes(k))) posCount++;
                    if (negative.some(k => t.includes(k))) negCount++;
                });

                let pct = 50;
                let status = 'statusNeutral';
                const total = posCount + negCount;
                if (total > 0) {
                    pct = (posCount / total) * 100;
                    if (pct > 60) status = 'statusPositive';
                    else if (pct < 40) status = 'statusNegative';
                }

                const bar = document.getElementById('moodProgressBar');
                const label = document.getElementById('moodBalanceText');

                if (bar) {
                    bar.style.width = `${pct}%`;
                    bar.style.background = pct < 30 ? '#EF4444' : 'linear-gradient(90deg, #10B981, #34D399)';
                }
                if (label) {
                    label.textContent = I18nData[AppState.lang][status];
                }
            }
        },

        cursor: {
            init: function () {
                // Simplified cursor init
                const glow = document.createElement('div');
                glow.className = 'cursor-glow';
                document.body.appendChild(glow);
                let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
                let mx = cx, my = cy;
                document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
                function loop() {
                    cx += (mx - cx) * 0.1;
                    cy += (my - cy) * 0.1;
                    glow.style.left = cx + 'px'; glow.style.top = cy + 'px';
                    requestAnimationFrame(loop);
                }
                loop();
            }
        }
    },

    methods: {
        toggleLanguage: function () {
            AppState.lang = AppState.lang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('appLang', AppState.lang);
            this.updateTexts();
            // Restart typewriter
            const intro = document.getElementById('introText');
            if (intro) {
                intro.classList.remove('typewriter');
                void intro.offsetWidth;
                // Update text content in updateTexts, then re-add class
                setTimeout(() => intro.classList.add('typewriter'), 50);
            }
        },

        toggleTheme: function () {
            // Cycle: default -> forest -> ocean -> default
            const order = ['default', 'forest', 'ocean'];
            const currentIdx = order.indexOf(AppState.theme);
            const nextIdx = (currentIdx + 1) % order.length;

            AppState.theme = order[nextIdx];
            localStorage.setItem('appTheme', AppState.theme);
            App.ui.applyTheme(AppState.theme);

            console.log(`Switched to theme: ${AppState.theme}`);
        },

        updateTexts: function () {
            const lang = AppState.lang;
            const dict = I18nData[lang];

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const k = el.getAttribute('data-i18n');
                if (dict[k]) el.textContent = dict[k];
            });

            // Extras
            const input = document.getElementById('moodInput');
            if (input) input.placeholder = dict.placeholder;

            const counter = document.getElementById('counter');
            if (counter) counter.textContent = dict.clickCount + AppState.clickCount;

            // Balance Label
            App.modules.dashboard.updateBalance();
        }
    },

    ui: {
        showToast: function (text) {
            const t = document.createElement('div');
            t.className = 'toast';
            t.textContent = text;
            document.body.appendChild(t);
            setTimeout(() => t.classList.add('show'), 10);
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 3000);
        },
        changeRandomBg: function () {
            // Only changes explicit body background color, does not override theme gradient if not desired
            // In new theme system, maybe we don't want this? 
            // Let's keep it as an "Easter Egg" but simpler
            // document.body.style.backgroundColor = ... // This overrides gradient
            // We'll skip random BG color to preserve the nice gradients.
        },
        initTheme: function () {
            this.applyTheme(AppState.theme);
        },
        applyTheme: function (themeName) {
            const theme = Themes[themeName] || Themes['default'];
            const root = document.documentElement;
            // Iterate over properties (e.g., --main-bg, --accent-color)
            for (const [key, value] of Object.entries(theme)) {
                root.style.setProperty(key, value);
            }
        }
    },

    audio: {
        playClick: function () {
            try {
                if (!AppState.audioContext) {
                    AppState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                const ctx = AppState.audioContext;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
            } catch (e) { console.warn("Audio error", e); }
        }
    }
};

// === 5. Bootstrap (启动) ===
window.onload = function () {
    App.init();
};
