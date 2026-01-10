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

// Simple XORShift PRNG for reproducibility
function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function generateStatisticalNumbers(conditions) {
    const { dateString, weatherCondition, daylightMinutes } = conditions;

    if (!allDraws || allDraws.length === 0) {
        console.warn("Draw data not loaded or empty for statistical generation. Falling back to random.");
        return generateLotteryNumbers();
    }

    const mainNumberFrequencies = new Map();
    const euroNumberFrequencies = new Map();

    for (let i = 1; i <= 50; i++) mainNumberFrequencies.set(i, 0);
    for (let i = 1; i <= 12; i++) euroNumberFrequencies.set(i, 0);

    let filteredDraws = allDraws;

    // Filter by weather condition
    if (weatherCondition) {
        filteredDraws = filteredDraws.filter(draw =>
            draw.weather && draw.weather.condition.toLowerCase() === weatherCondition.toLowerCase()
        );
    }

    // Filter by daylight minutes (within a range)
    if (typeof daylightMinutes === 'number') {
        const range = 60; // +/- 60 minutes
        filteredDraws = filteredDraws.filter(draw =>
            draw.daylight_minutes >= (daylightMinutes - range) && draw.daylight_minutes <= (daylightMinutes + range)
        );
    }

    // If no draws match the detailed conditions, fall back to the most recent N draws
    const drawsToConsider = filteredDraws.length > 0 ? filteredDraws : allDraws.slice(0, Math.min(allDraws.length, 100));

    if (drawsToConsider.length === 0) {
        console.warn("No relevant historical draws found for the given conditions. Falling back to random.");
        return generateLotteryNumbers();
    }

    drawsToConsider.forEach(draw => {
        draw.numbers.forEach(num => {
            mainNumberFrequencies.set(num, mainNumberFrequencies.get(num) + 1);
        });
        draw.euro_numbers.forEach(num => {
            euroNumberFrequencies.set(num, euroNumberFrequencies.get(num) + 1);
        });
    });

    // Create a seed from the date string
    const seed = dateString.split('-').map(Number).reduce((acc, val) => acc + val, 0);
    const random = mulberry32(seed); // Get a seeded PRNG function

    const selectNumbers = (frequencies, count, min, max) => {
        let selected = new Set();
        const weightedList = [];

        frequencies.forEach((freq, num) => {
            for (let i = 0; i < freq + 1; i++) {
                weightedList.push(num);
            }
        });

        if (weightedList.length === 0) {
            // Fallback to simple random selection if no weighted options
            while (selected.size < count) {
                selected.add(Math.floor(random() * (max - min + 1)) + min);
            }
            return [...selected].sort((a, b) => a - b);
        }

        while (selected.size < count) {
            const randomIndex = Math.floor(random() * weightedList.length);
            const chosenNum = weightedList[randomIndex];
            selected.add(chosenNum);
        }
        return [...selected].sort((a, b) => a - b);
    };

    const statisticalMainNumbers = selectNumbers(mainNumberFrequencies, 5, 1, 50);
    const statisticalEuroNumbers = selectNumbers(euroNumberFrequencies, 2, 1, 12);

    return { mainNumbers: statisticalMainNumbers, euroNumbers: statisticalEuroNumbers };
}

// Helper function to approximate daylight minutes based on date
// This is a simplified approximation for prototype purposes.
// A real application would use a more accurate library or API.
function getApproximateDaylightMinutes(date) {
    const d = new Date(date);
    const month = d.getMonth(); // 0-11

    // Very rough approximation: longer days in summer, shorter in winter
    // Values are just illustrative and not geographically accurate
    if (month >= 5 && month <= 7) { // June, July, August (summer)
        return 900; // 15 hours
    } else if (month >= 11 || month <= 1) { // December, January, February (winter)
        return 500; // ~8.3 hours
    } else if (month >= 2 && month <= 4) { // March, April, May (spring)
        return 700; // ~11.6 hours
    } else { // September, October, November (autumn)
        return 600; // 10 hours
    }
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

let allDraws = [];
let translations = {};

async function fetchData() {
  try {
    const [drawsResponse, translationsResponse] = await Promise.all([
      fetch('public/data/eurojackpot_context_dataset.json'),
      fetch('public/data/translations.json')
    ]);

    if (!drawsResponse.ok) {
      throw new Error(`HTTP error! status: ${drawsResponse.status} for draws data`);
    }
    if (!translationsResponse.ok) {
      throw new Error(`HTTP error! status: ${translationsResponse.status} for translations data`);
    }

    allDraws = await drawsResponse.json();
    translations = await translationsResponse.json();

    return { allDraws, translations };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return { allDraws: [], translations: {} }; // Return defaults on error
  }
}

document.addEventListener('DOMContentLoaded', async () => {
    const { allDraws: fetchedDraws, translations: fetchedTranslations } = await fetchData();
  console.log('Draw data loaded:', allDraws.length, 'draws');
  console.log('translations data loaded:', translations.length, 'translations');
  // Any other initialization that depends on allDraws can go here later
});

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



    const generatorBtn = document.getElementById('generator-btn');
    if(generatorBtn) {
        generatorBtn.addEventListener('click', () => {
            const { mainNumbers, euroNumbers } = generateLotteryNumbers();
            window.location.href = `loading.html?main=${mainNumbers.join(',')}&euro=${euroNumbers.join(',')}`;
        });
    }

    const statisticalGeneratorBtn = document.getElementById('statistical-generator-btn');
    if(statisticalGeneratorBtn) {
        statisticalGeneratorBtn.addEventListener('click', () => {
            const today = new Date();
            const dateString = today.toISOString().slice(0, 10); // YYYY-MM-DD
            const currentDaylightMinutes = getApproximateDaylightMinutes(today);
            const currentMonth = today.getMonth(); // 0-11
            let currentWeatherCondition = 'Cloudy'; // Default

            // Simple heuristic for weather based on month
            if (currentMonth >= 5 && currentMonth <= 7) { // Summer months
                currentWeatherCondition = 'Sunny';
            } else if (currentMonth >= 11 || currentMonth <= 1) { // Winter months
                currentWeatherCondition = 'Snowy'; // Note: Mock data only has Cloudy/Sunny
            } else {
                currentWeatherCondition = 'Cloudy'; // Spring/Autumn default
            }

            const conditions = {
                dateString: dateString,
                weatherCondition: currentWeatherCondition,
                daylightMinutes: currentDaylightMinutes
            };

            console.log('Generating statistical numbers with conditions:', conditions);

            const { mainNumbers, euroNumbers } = generateStatisticalNumbers(conditions);
            window.location.href = `loading.html?main=${mainNumbers.join(',')}&euro=${euroNumbers.join(',')}`;
        });
    }
