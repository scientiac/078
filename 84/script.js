// Cursor Tracking with delay
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function followMouse() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(followMouse);
}
followMouse();

// Typing Effect yeta xa
function typeText(element, text, speed = 50) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Rocket crash effect {yesma crash chai ali disbalance vayera janxa - you can adjust here}
const rocket = document.getElementById("rocket");
const target = document.getElementById("rocket-target");
const message = document.getElementById("secret-message");
const explosion = document.getElementById("explosion");
const sound = document.getElementById("explosion-sound");

rocket.addEventListener("click", () => {
  const rocketRect = rocket.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const offsetX = targetRect.left - rocketRect.left + target.offsetWidth / 2 - 40;
  const offsetY = targetRect.top - rocketRect.top + target.offsetHeight / 2 - 40;

  gsap.to("#rocket", {
    duration: 3,
    ease: "power2.inOut",
    x: offsetX,
    y: offsetY,
    rotation: 720,
    onComplete: () => {
      rocket.style.display = "none";
      explosion.style.display = 'block';
      sound.play();

      // Adding the particle explosion
      createParticles(targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height / 2);

      gsap.fromTo(explosion, { scale: 0, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.5 });
      gsap.to(message, { display: 'block', opacity: 1, delay: 0.5 });

      setTimeout(() => {
        typeText(message, "Awesome you found it and gave it to ALIENS !", 100);
      }, 600);
    }
  });
});

// Create particle burst with Three.js --- completely ai stuffs
function createParticles(x, y) {
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.position = "fixed";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = "6px";
    particle.style.height = "6px";
    particle.style.background = "#ff4d4d";
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = 999;
    document.body.appendChild(particle);

    gsap.to(particle, {
      duration: 1.2,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      scale: 0,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  }
}

//GSAP title animation
gsap.from(".animated-title", {
  y: -50,
  opacity: 0,
  duration: 1.5,
  ease: "power2.out"
});

// Three.js Background - again completely ai
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bg-canvas').appendChild(renderer.domElement);

// creating random Stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starVertices = [];

for (let i = 0; i < starCount; i++) {
  starVertices.push((Math.random() - 0.5) * 100);
  starVertices.push((Math.random() - 0.5) * 100);
  starVertices.push((Math.random() - 0.5) * 100);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xff4d4d, size: 0.4 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Planet - addding earth
const textureLoader = new THREE.TextureLoader();
const planetTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const planetGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.set(-3, 2, -5);
scene.add(planet);

//Lights
const ambientLight = new THREE.AmbientLight(0xff4d4d, 0.7);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

//Interactive stars
document.addEventListener("mousemove", (e) => {
  stars.rotation.y = e.clientX / window.innerWidth * 0.5;
  stars.rotation.x = e.clientY / window.innerHeight * 0.5;
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  planet.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("sound-toggle");

  bgMusic.volume = 0.3;
  toggleBtn.textContent = "🔇"; // default muted icon

  // Toggle music only through the button
  toggleBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        toggleBtn.textContent = "🔊";
      }).catch(err => {
        console.warn("Autoplay blocked:", err);
      });
    } else {
      bgMusic.pause();
      toggleBtn.textContent = "🔇";
    }
  });
});

const explosionSound = document.getElementById("explosion-sound");
document.addEventListener("DOMContentLoaded", () => {
  explosionSound.volume = 0.3; // adjust volume
  explosionSound.play().catch(err => {
    console.warn("Autoplay failed due to browser policy.");
  });
});


document.getElementById('ignite-button').addEventListener('click', () => {
  const shuttle = document.getElementById('space-shuttle');
  const message = document.getElementById('shuttle-message');

  shuttle.classList.add('launched');

  setTimeout(() => {
    message.classList.add('visible');
  }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
  const igniteButton = document.getElementById('ignite-button');

  igniteButton.addEventListener('click', () => {
    igniteButton.remove();
  });
});


