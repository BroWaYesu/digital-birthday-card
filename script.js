const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const card = document.querySelector('.card');
const audio = document.getElementById('background-music');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const themeSwitcher = document.getElementById('theme-switcher');
const playPauseBtn = document.getElementById('play-pause-btn');
const speakerCones = document.querySelectorAll('.speaker-cone');
const candles = document.querySelectorAll('.candle');


// --- Themes ---
const randomThemes = [
    { bg: '#1a1a1a', card: '#2a2a2a', text: '#fff', heading: '#f0a500' },
    { bg: '#f0f2f5', card: '#ffffff', text: '#333', heading: '#d18c00' },
    { bg: '#2c2144', card: '#4a3a69', text: '#f5eafc', heading: '#ff8c69' },
    { bg: '#0f4c75', card: '#1b6ca8', text: '#bbe1fa', heading: '#3282b8' },
    { bg: '#2f4858', card: '#3e5c76', text: '#f5f5f5', heading: '#f7b801' },
    { bg: '#283618', card: '#606c38', text: '#fefae0', heading: '#dda15e' },
    { bg: '#003049', card: '#d62828', text: '#f77f00', heading: '#fcbf49' },
    { bg: '#3d405b', card: '#81b29a', text: '#f4f1de', heading: '#e07a5f' },
    { bg: '#14213d', card: '#000000', text: '#fca311', heading: '#e5e5e5' },
    { bg: '#264653', card: '#2a9d8f', text: '#e9c46a', heading: '#f4a261' },
    { bg: '#ffbe0b', card: '#fb5607', text: '#ff006e', heading: '#8338ec' },
    { bg: '#540b0e', card: '#9e2a2b', text: '#fff3b0', heading: '#e09f3e' },
    { bg: '#006400', card: '#2e8b57', text: '#f0fff0', heading: '#98fb98' },
    { bg: '#6a040f', card: '#9d0208', text: '#faa307', heading: '#f48c06' }
];
let lastThemeIndex = -1;

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    card.style.display = 'block';
    
    audio.play().catch(error => console.error("Audio playback failed:", error));
    speakerCones.forEach(cone => cone.classList.add('vibrating'));

    renderConfetti(); // Start the confetti animation loop
});

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = 'Pause';
        speakerCones.forEach(cone => cone.classList.add('vibrating'));
    } else {
        audio.pause();
        playPauseBtn.textContent = 'Play';
        speakerCones.forEach(cone => cone.classList.remove('vibrating'));
    }
});

themeSwitcher.addEventListener('click', () => {
    document.body.removeAttribute('data-theme');

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * randomThemes.length);
    } while (randomIndex === lastThemeIndex);
    lastThemeIndex = randomIndex;
    
    const theme = randomThemes[randomIndex];
    
    const style = document.body.style;
    style.setProperty('--bg-color', theme.bg);
    style.setProperty('--card-color', theme.card);
    style.setProperty('--text-color', theme.text);
    style.setProperty('--heading-color', theme.heading);
    style.setProperty('--border-color', theme.heading);
});

candles.forEach(candle => {
    candle.addEventListener('click', () => {
        candle.classList.add('blown-out');
    });
});

window.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') return;
    if (card.style.display === 'block') {
        createConfettiBurst(event.clientX, event.clientY);
        createGlowEffect(event.clientX, event.clientY);
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// --- Animation Loops ---
const glowingEffects = [];
const glowColors = ["#ff00ff", "#00ffff", "#ff006e", "#3a86ff", "#06d6a0"]; // Colors from club lights

function renderConfetti() {
    requestAnimationFrame(renderConfetti);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas once
    drawConfetti();
    drawGlowEffects();
}

// --- Confetti Code ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const confettiColors = ["#f0a500", "#f4b400", "#f8c300", "#ffcf33", "#ffe066"];
const confettiCount = 200;
const confetti = [];

function setupConfetti() {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push(createConfettiParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height - canvas.height
        ));
    }
}

function createConfettiBurst(x, y) {
    for (let i = 0; i < 50; i++) {
        confetti.push(createConfettiParticle(x, y, true));
    }
}

function createConfettiParticle(x, y, isBurst = false) {
    const speed = isBurst ? Math.random() * 5 + 4 : Math.random() * 3 + 2;
    const angle = isBurst ? Math.random() * 360 : 270;
    const velocity = isBurst ? {
        x: Math.cos(angle * Math.PI / 180) * speed,
        y: Math.sin(angle * Math.PI / 180) * speed
    } : { x: 0, y: speed };

    return {
        x: x, y: y, size: Math.random() * 10 + 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        velocity: velocity, rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10, gravity: isBurst ? 0.1 : 0
    };
}

function drawConfetti() {
    confetti.forEach((c, index) => {
        ctx.save();
        ctx.fillStyle = c.color;
        ctx.translate(c.x + c.size / 2, c.y + c.size / 2);
        ctx.rotate(c.rotation * Math.PI / 180);
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();

        if (c.velocity.y > 0) { c.y += c.velocity.y; } 
        else {
            c.velocity.y += c.gravity;
            c.x += c.velocity.x;
            c.y += c.velocity.y;
        }
        c.rotation += c.spin;
        
        if (c.y > canvas.height + 20) {
            if (confetti.length > confettiCount) { confetti.splice(index, 1); } 
            else {
                c.y = -20;
                c.x = Math.random() * canvas.width;
            }
        }
    });
}

// --- Glowing Effects Code ---
function createGlowEffect(x, y) {
    glowingEffects.push({
        x: x,
        y: y,
        radius: 5,
        maxRadius: Math.random() * 50 + 70,
        opacity: 0.8,
        color: glowColors[Math.floor(Math.random() * glowColors.length)],
        speed: Math.random() * 1.5 + 1
    });
}

function drawGlowEffects() {
    for (let i = 0; i < glowingEffects.length; i++) {
        const g = glowingEffects[i];

        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(g.color.slice(1,3), 16)}, ${parseInt(g.color.slice(3,5), 16)}, ${parseInt(g.color.slice(5,7), 16)}, ${g.opacity})`;
        ctx.shadowBlur = g.radius / 2;
        ctx.shadowColor = g.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        g.radius += g.speed;
        g.opacity -= 0.01; // Fade out

        // Remove effect once it's faded or too large
        if (g.opacity <= 0 || g.radius > g.maxRadius) {
            glowingEffects.splice(i, 1);
            i--; // Adjust index due to splice
        }
    }
                     }
