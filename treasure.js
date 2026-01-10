document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('treasure-canvas');
    const ctx = canvas.getContext('2d');
    const urlParams = new URLSearchParams(window.location.search);
    const mainNumbers = urlParams.get('main');
    const euroNumbers = urlParams.get('euro');

    // i18n
    const translations = {
        en: { loadingText: "Checking your treasure..." },
        de: { loadingText: "Überprüfe deinen Schatz..." },
        es: { loadingText: "Comprobando tu tesoro..." }
    };
    const lang = localStorage.getItem('language') || 'en';
    const loadingText = document.querySelector('.loading-text');
    if (translations[lang] && loadingText) {
        loadingText.textContent = translations[lang].loadingText;
    }

    let lidAngle = 0;
    let shakeX = 0;
    let glowAlpha = 0;
    let animationStage = 'shake'; // shake, open, glow, fly-out
    let frame = 0;

    function drawChestBody() {
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(100, 150, 200, 100);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(90, 140, 220, 10);
    }

    function drawChestLid(angle) {
        ctx.save();
        ctx.translate(100, 150);
        ctx.rotate(angle);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, -50, 200, 50);
        ctx.restore();
    }

    function drawGlow() {
        if (glowAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = glowAlpha;
            const gradient = ctx.createRadialGradient(200, 150, 10, 200, 150, 100);
            gradient.addColorStop(0, 'rgba(255, 255, 224, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 224, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(shakeX, 0);

        drawChestBody();
        drawChestLid(lidAngle);

        ctx.restore();

        drawGlow();

        frame++;

        switch (animationStage) {
            case 'shake':
                if (frame < 60) {
                    shakeX = Math.sin(frame * 0.5) * 5;
                } else {
                    shakeX = 0;
                    animationStage = 'open';
                    frame = 0;
                }
                break;
            case 'open':
                if (lidAngle > -Math.PI / 1.5) {
                    lidAngle -= 0.05;
                } else {
                    animationStage = 'glow';
                    frame = 0;
                }
                break;
            case 'glow':
                if (glowAlpha < 1) {
                    glowAlpha += 0.05;
                }
                if (frame > 30) {
                    animationStage = 'redirect';
                }
                break;
            case 'redirect':
                 window.location.href = `result.html?main=${mainNumbers}&euro=${euroNumbers}`;
                 return; // Stop the animation
        }

        requestAnimationFrame(animate);
    }

    animate();
});
