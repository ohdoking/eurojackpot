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
        title: "Eurojackpot Pro",
        subtitle: "Your ultimate guide to the Eurojackpot lottery.",
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
        navHome: "Home",
        navGenerator: "Generator",
        navBlog: "Blog",
        navInfo: "Information",
        navAbout: "About Us",
        navContact: "Contact",
        welcomeTitle: "Welcome to Eurojackpot Pro",
        welcomeText: "Your one-stop destination for everything related to the Eurojackpot lottery. Whether you're looking for the latest results, a tool to generate your lucky numbers, or in-depth articles about lottery strategies, we have you covered.",
        featuredTitle: "Featured Articles",
        post1Title: "Understanding the Odds: A Deep Dive",
        post1Summary: "Ever wondered what your actual chances of winning the Eurojackpot are? In this article, we break down the mathematics behind the odds in a simple, easy-to-understand way.",
        readMore: "Read More",
        aboutTitle: "About Eurojackpot Pro",
        aboutText1: "Welcome to Eurojackpot Pro, your number one source for all things related to the Eurojackpot lottery. We're dedicated to giving you the very best of information, with a focus on accuracy, timeliness, and usability.",
        aboutText2: "Founded in 2026, Eurojackpot Pro has come a long way from its beginnings. When we first started out, our passion for helping lottery enthusiasts drove us to create a comprehensive platform for players. We now serve customers all over Europe, and are thrilled to be a part of the exciting world of lottery.",
        aboutText3: "We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.",
        contactTitle: "Contact Us",
        contactText: "Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.",
        formName: "Name",
        formEmail: "Email",
        formMessage: "Message",
        formSubmit: "Send Message",
        blogTitle: "Lottery Blog",
        post1Intro: "The dream of winning the lottery is universal, but what are the actual mathematical odds of hitting the Eurojackpot jackpot? In this article, we'll explore the numbers behind the game to give you a clearer picture of your chances.",
        post1Subtitle1: "The Basics of Combinations",
        post1Text1: "To understand lottery odds, we first need to understand the concept of combinations. In mathematics, a combination is a selection of items from a collection, such that the order of selection does not matter. For Eurojackpot, you choose 5 numbers from 50, and 2 numbers from 12. These are two separate combination calculations.",
        post1Subtitle2: "Calculating the Odds",
        post1Text2: "The formula for combinations is nCr = n! / (r! * (n-r)!), where n is the total number of items to choose from, and r is the number of items to choose.",
        post1Text3: "For the main numbers: n=50, r=5. So, 50! / (5! * 45!) = 2,118,760.",
        post1Text4: "For the Euro numbers: n=12, r=2. So, 12! / (2! * 10!) = 66.",
        post1Text5: "To get the total odds of winning the jackpot, you multiply the odds of both sets of numbers: 2,118,760 * 66 = 139,838,160. So, the odds of winning the Eurojackpot jackpot are approximately 1 in 140 million.",
        post1Subtitle3: "What Does This Mean?",
        post1Text6: "While the odds are steep, it's important to remember that lotteries are a game of chance. Every ticket has an equal opportunity to win. The key is to play for fun and within your means. Good luck!",
        navTitle: "Navigation",
        footer: "&copy; 2026 Eurojackpot Pro. All Rights Reserved.",
        footerDisclaimer: "Please play responsibly. You must be 18 or older to play."
    },
    de: {
        // ... German translations
    },
    es: {
        // ... Spanish translations
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


if (window.location.pathname.includes('generator.html')) {
    const generatorBtn = document.getElementById('generator-btn');
    if(generatorBtn) {
        generatorBtn.addEventListener('click', () => {
            const { mainNumbers, euroNumbers } = generateLotteryNumbers();
            window.location.href = `loading.html?main=${mainNumbers.join(',')}&euro=${euroNumbers.join(',')}`;
        });
    }
}