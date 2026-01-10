function generateLotteryNumbers() {
    const generateUniqueNumbers = (count, min, max) => {
        const numbers = new Set();
        while (numbers.size < count) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(num);
        }
        return [...numbers].sort((a, b) => a - b);
    };
    const mainNumbers = generateUniqueNumbers(5, 1, 50);
    const euroNumbers = generateUniqueNumbers(2, 1, 12);
    return { mainNumbers, euroNumbers };
}

class LotteryNumbers extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .numbers-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .number {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 2rem;
                    font-weight: bold;
                    color: white;
                    transform: scale(0);
                    animation: flip 0.5s ease-out forwards;
                }
                .main-number {
                    background-color: #4a90e2;
                    box-shadow: 0 2px 5px rgba(74, 144, 226, 0.4);

                }
                .euro-number {
                    background-color: #f5a623;
                    box-shadow: 0 2px 5px rgba(245, 166, 35, 0.4);
                }
                @keyframes flip {
                    from {
                        transform: scale(0) rotateY(180deg);
                    }
                    to {
                        transform: scale(1) rotateY(0deg);
                    }
                }
            </style>
            <div class="numbers-container main-numbers"></div>
            <div class="numbers-container euro-numbers"></div>
        `;
    }

    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const mainNumbers = urlParams.get('main')?.split(',').map(Number);
        const euroNumbers = urlParams.get('euro')?.split(',').map(Number);

        if (mainNumbers && euroNumbers) {
            this.render(mainNumbers, euroNumbers);
        } else {
            const { mainNumbers, euroNumbers } = generateLotteryNumbers();
            this.render(mainNumbers, euroNumbers);
        }
    }

    render(mainNumbers, euroNumbers) {
        this._renderNumbers(mainNumbers, '.main-numbers', 'main-number');
        this._renderNumbers(euroNumbers, '.euro-numbers', 'euro-number');
    }

    _renderNumbers(numbers, containerSelector, numberClass) {
        const container = this.shadowRoot.querySelector(containerSelector);
        container.innerHTML = '';
        numbers.forEach((number, index) => {
            const el = document.createElement('div');
            el.className = `number ${numberClass}`;
            el.textContent = number;
            el.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(el);
        });
    }
}

customElements.define('lottery-numbers', LotteryNumbers);

const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
}

themeSwitcherBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark-mode' : '');
});

// Internationalization
const translations = {
    en: {
        title: "Eurojackpot",
        subtitle: "Your weekly chance to win big!",
        cardTitle: "Your Lucky Numbers",
        generateButton: "Generate New Numbers",
        generateDescription: "Click the button below to generate your lucky numbers and see if you are the next millionaire!",
        resultTitle: "Your Lucky Numbers",
        resultSubtitle: "Here are your generated numbers.",
        backButton: "Back to Generator",
        howItWorksTitle: "How It Works",
        step1: "Click the \"Generate\" button.",
        step2: "Watch the treasure chest open.",
        step3: "See your lucky numbers!",
        footer: "&copy; 2026 OhDoKing Builder. All Rights Reserved."
    },
    de: {
        title: "Eurojackpot",
        subtitle: "Ihre wöchentliche Chance auf einen großen Gewinn!",
        cardTitle: "Ihre Glückszahlen",
        generateButton: "Neue Nummern generieren",
        generateDescription: "Klicken Sie auf die Schaltfläche unten, um Ihre Glückszahlen zu generieren und zu sehen, ob Sie der nächste Millionär sind!",
        resultTitle: "Ihre Glückszahlen",
        resultSubtitle: "Hier sind Ihre generierten Nummern.",
        backButton: "Zurück zum Generator",
        howItWorksTitle: "Wie es funktioniert",
        step1: "Klicken Sie auf die Schaltfläche \"Generieren\".",
        step2: "Beobachten Sie, wie sich die Schatztruhe öffnet.",
        step3: "Sehen Sie Ihre Glückszahlen!",
        footer: "&copy; 2026 OhDoKing Builder. Alle Rechte vorbehalten."
    },
    es: {
        title: "Eurojackpot",
        subtitle: "¡Tu oportunidad semanal de ganar a lo grande!",
        cardTitle: "Tus Números de la Suerte",
        generateButton: "Generar nuevos números",
        generateDescription: "¡Haga clic en el botón de abajo para generar sus números de la suerte y ver si es el próximo millonario!",
        resultTitle: "Tus Números de la Suerte",
        resultSubtitle: "Aquí están tus números generados.",
        backButton: "Volver al Generador",
        howItWorksTitle: "Cómo funciona",
        step1: "Haga clic en el botón \"Generar\".",
        step2: "Mira cómo se abre el cofre del tesoro.",
        step3: "¡Vea sus números de la suerte!",
        footer: "&copy; 2026 OhDoKing Builder. Todos los derechos reservados."
    }
};

const languageSelect = document.getElementById('language-select');

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.innerHTML = translations[lang][key];
    });
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
}

if(languageSelect) {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        languageSelect.value = savedLanguage;
        setLanguage(savedLanguage);
    } else {
        const browserLanguage = navigator.language.split('-')[0]; // 'en-US' -> 'en'
        if (translations[browserLanguage]) {
            languageSelect.value = browserLanguage;
            setLanguage(browserLanguage);
        } else {
            setLanguage('en');
        }
    }

    languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
}


if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/ohdokingbuilder/') {
    const generatorBtn = document.getElementById('generator-btn');
    if(generatorBtn) {
        generatorBtn.addEventListener('click', () => {
            const { mainNumbers, euroNumbers } = generateLotteryNumbers();
            window.location.href = `loading.html?main=${mainNumbers.join(',')}&euro=${euroNumbers.join(',')}`;
        });
    }
}