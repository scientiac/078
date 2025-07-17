const imagePaths = [
  "images/logo-night-spaceduck.svg",
  "images/scientiac_pixel.png",
  "images/tux.png",
  "images/carboxide.png",
  "images/nix.png",
];

const scrapbookContainer = document.getElementById("scrapbook-images");

// Store positions of already-placed images
const placedImages = [];
const minDistance = 150; // Minimum distance between images

imagePaths.forEach((src, index) => {
  const imgDiv = document.createElement("div");
  imgDiv.className = "scrapbook-image";

  const img = document.createElement("img");
  img.src = src;
  img.alt = `Scrap Image ${index + 1}`;

  imgDiv.appendChild(img);

  const imgWidth = 100;
  const imgHeight = 100;

  let positionFound = false;
  let top, left;
  let attempts = 0;

  while (!positionFound && attempts < 100) {
    attempts++;

    top = Math.floor(Math.random() * (window.innerHeight - imgHeight));
    left = Math.floor(Math.random() * (window.innerWidth - imgWidth));

    const centerX = left + imgWidth / 2;
    const centerY = top + imgHeight / 2;

    // Check if far enough from all placed images
    const tooClose = placedImages.some(({ x, y }) => {
      const dx = x - centerX;
      const dy = y - centerY;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });

    if (!tooClose) {
      positionFound = true;
      placedImages.push({ x: centerX, y: centerY });
    }
  }

  const rotation = Math.floor(Math.random() * 20 - 10); // -10 to +10 deg
  imgDiv.style.transform = `rotate(${rotation}deg)`;
  imgDiv.style.top = `${top}px`;
  imgDiv.style.left = `${left}px`;

  scrapbookContainer.appendChild(imgDiv);
});
