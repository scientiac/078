const imagePaths = [
  "images/logo-night-spaceduck.svg",
  "images/scientiac_pixel.png",
  "images/tux.png",
  "images/carboxide.png",
  "images/nix.png",
];

const scrapbookContainer = document.getElementById("scrapbook-images");

// Hardcode the SVG box coordinates
const svgBox = {
  x: window.innerWidth / 2 - 250, // since SVG width = 500, centered
  y: document.querySelector('.container').getBoundingClientRect().top,
  width: 500,
  height: 400,
};

const placedImages = [];
const minDistance = 130; // pixels between images
const imageSize = 100;   // assumed image width/height

function isOverlapping(x, y, existing, svgBox) {
  const cx = x + imageSize / 2;
  const cy = y + imageSize / 2;

  // 🛑 Check against other images
  for (const pos of existing) {
    const dx = cx - pos.x;
    const dy = cy - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDistance) return true;
  }

  // 🛑 Check against the SVG zone
  const overlapX = x + imageSize > svgBox.x && x < svgBox.x + svgBox.width;
  const overlapY = y + imageSize > svgBox.y && y < svgBox.y + svgBox.height;

  return overlapX && overlapY;
}

imagePaths.forEach((src, index) => {
  const imgDiv = document.createElement("div");
  imgDiv.className = "scrapbook-image";

  const img = document.createElement("img");
  img.src = src;
  img.alt = `Scrap Image ${index + 1}`;
  img.style.width = `${imageSize}px`;

  imgDiv.appendChild(img);

  let x, y, attempts = 0;
  let placed = false;

  while (attempts < 100 && !placed) {
    x = Math.floor(Math.random() * (window.innerWidth - imageSize));
    y = Math.floor(Math.random() * (window.innerHeight - imageSize));
    if (!isOverlapping(x, y, placedImages, svgBox)) {
      placed = true;
      placedImages.push({ x: x + imageSize / 2, y: y + imageSize / 2 });
      imgDiv.style.left = `${x}px`;
      imgDiv.style.top = `${y}px`;
      imgDiv.style.transform = `rotate(${Math.floor(Math.random() * 20 - 10)}deg)`;
      scrapbookContainer.appendChild(imgDiv);
    }
    attempts++;
  }
});

