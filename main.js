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
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
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
        this.generate();
    }

    generate() {
        const mainNumbers = this._generateUniqueNumbers(5, 1, 50);
        const euroNumbers = this._generateUniqueNumbers(2, 1, 12);

        this._renderNumbers(mainNumbers, '.main-numbers', 'main-number');
        this._renderNumbers(euroNumbers, '.euro-numbers', 'euro-number');
    }

    _generateUniqueNumbers(count, min, max) {
        const numbers = new Set();
        while (numbers.size < count) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(num);
        }
        return [...numbers].sort((a, b) => a - b);
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

document.getElementById('generator-btn').addEventListener('click', () => {
    document.querySelector('lottery-numbers').generate();
});

const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
}

themeSwitcherBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', '');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
});
