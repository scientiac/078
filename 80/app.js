// Matrix background effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
const matrixArray = matrix.split("");

const font_size = 10;
const columns = canvas.width / font_size;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff00';
    ctx.font = font_size + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * font_size, drops[i] * font_size);
        
        if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Hacking simulation
function startHackingSimulation() {
    const output = document.getElementById('hack-output');
    const progress = document.getElementById('progress');
    const button = document.querySelector('.cta-button');
    
    button.disabled = true;
    button.textContent = 'Scanning...';
    
    const steps = [
        'Initializing port scanner...',
        'Scanning target: 192.168.1.1',
        'Open ports found: 22, 80, 443, 8080',
        'Running vulnerability assessment...',
        'Checking for SQL injection vulnerabilities...',
        'Testing XSS attack vectors...',
        'Analyzing SSL/TLS configuration...',
        'Performing OS fingerprinting...',
        'Scanning for default credentials...',
        'Assessment complete. Generating report...'
    ];
    
    output.innerHTML = '';
    let stepIndex = 0;
    let progressValue = 0;
    
    const interval = setInterval(() => {
        if (stepIndex < steps.length) {
            const line = document.createElement('div');
            line.className = 'sim-line';
            line.style.color = stepIndex === steps.length - 1 ? '#00ccff' : '#00ff00';
            line.textContent = `[${new Date().toLocaleTimeString()}] ${steps[stepIndex]}`;
            output.appendChild(line);
            
            progressValue += 10;
            progress.style.width = progressValue + '%';
            
            stepIndex++;
        } else {
            clearInterval(interval);
            button.disabled = false;
            button.textContent = 'Run Another Scan';
            
            const summary = document.createElement('div');
            summary.className = 'sim-line';
            summary.style.color = '#ff0066';
            summary.style.marginTop = '10px';
            summary.textContent = '[RESULT] Scan completed successfully. No critical vulnerabilities found.';
            output.appendChild(summary);
        }
    }, 800);
}

// Add some interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add cursor blink effect to subtitle
    setTimeout(() => {
        const subtitle = document.querySelector('.subtitle');
        subtitle.style.borderRight = '2px solid transparent';
        
        setInterval(() => {
            subtitle.style.borderRight = subtitle.style.borderRight === '2px solid transparent' 
                ? '2px solid #00ccff' 
                : '2px solid transparent';
        }, 500);
    }, 4000);
});

// Add keyboard shortcut for simulation
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        startHackingSimulation();
    }
});