
const phrases = [" Developer ", "AI Explorer ", "Python Enthusiast "];
const typed = document.querySelector('.typed');
let i = 0, j = 0, current = [], isDeleting = false;

function loop() {
  typed.textContent = current.join('');
  if (!isDeleting && j <= phrases[i].length) {
    current.push(phrases[i][j]);
    j++;
  } else if (isDeleting && j > 0) {
    current.pop();
    j--;
  }

  if (j === phrases[i].length) {
    isDeleting = true;
    setTimeout(loop, 1000);
    return;
  }

  if (j === 0 && isDeleting) {
    isDeleting = false;
    i = (i + 1) % phrases.length;
  }

  setTimeout(loop, isDeleting ? 40 : 80);
}

loop();
