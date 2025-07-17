// Auto-detect available student folders
let availableFolders = ['00']; // Start with 00 as default
let currentIndex = 0; // Start at 00

// DOM elements
const canvasFrame = document.getElementById('canvasFrame');
const pastelDiv = document.getElementById('pastelDiv'); // Get the pastelDiv
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentNum = document.getElementById('currentNum');
const pageTitle = document.getElementById('pageTitle'); // Get the new pageTitle element

// --- MODIFIED detectFolders function ---
// Read folders from a text file
async function detectFolders() {
    try {
        const response = await fetch('public-canvas.txt');
        if (!response.ok) {
            console.error('Failed to load public-canvas.txt:', response.statusText);
            return ['00']; // Fallback to only '00' if file not found or error
        }
        const text = await response.text();
        // Split by comma, trim whitespace from each entry, and filter out empty strings
        const folders = text.split(',').map(folder => folder.trim()).filter(folder => folder !== '');
        // Ensure '00' is always included, even if not in the file, and make sure folders are unique
        const uniqueFolders = [...new Set(['00', ...folders])];
        // Optionally, sort the folders numerically for consistent navigation
        uniqueFolders.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        return uniqueFolders;
    } catch (e) {
        console.error('Error reading public-canvas.txt', e);
        return ['00']; // Fallback in case of any error
    }
}
// --- END MODIFIED detectFolders function ---


// Load student canvas with animation
function loadCanvas(folderNum, direction = 'next') {
    // Determine the slide-out and slide-in classes for the container
    const slideOutClass = direction === 'next' ? 'slide-out-left-container' : 'slide-out-right-container';
    const slideInClass = direction === 'next' ? 'slide-in-right-container' : 'slide-in-left-container';

    // Apply slide-out animation to the container
    pastelDiv.classList.remove('slide-in-left-container', 'slide-in-right-container'); // Clear previous
    pastelDiv.classList.add(slideOutClass);

    // After the slide-out animation completes, change the src and slide in the new content
    // Use a timeout that matches the CSS transition duration (0.5s)
    setTimeout(() => {
        canvasFrame.src = `${folderNum}/index.html`;

        // Listen for the iframe to load to get its title
        canvasFrame.onload = () => {
            try {
                const iframeDoc = canvasFrame.contentDocument || canvasFrame.contentWindow.document;
                pageTitle.textContent = iframeDoc.title || `Canvas ${folderNum}`; // Set title, fallback if not found
            } catch (e) {
                console.error("Could not access iframe content:", e);
                pageTitle.textContent = `Canvas ${folderNum}`; // Fallback title
            } finally {
                // Remove slide-out class and apply slide-in animation to the container
                pastelDiv.classList.remove(slideOutClass);
                pastelDiv.classList.add(slideInClass);

                // After slide-in animation, remove the slide-in class
                pastelDiv.addEventListener('transitionend', function handler() {
                    pastelDiv.classList.remove(slideInClass);
                    pastelDiv.removeEventListener('transitionend', handler);
                }, { once: true }); // Use { once: true } to automatically remove the listener
            }
        };
    }, 500); // Match CSS transition duration

    currentIndex = availableFolders.indexOf(folderNum);
    updateNavigation();
}

// Show default view (00 page)
function showDefault() {
    loadCanvas('00', 'next'); // Treat default as a normal load
    // The pageTitle will be set by the iframe's onload handler
}

// Update navigation buttons and input
function updateNavigation() {
    currentNum.value = availableFolders[currentIndex];
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === availableFolders.length - 1;
}

// Navigate to previous
function navigatePrev() {
    if (currentIndex > 0) {
        const newFolder = availableFolders[currentIndex - 1];
        loadCanvas(newFolder, 'prev');
    }
}

// Navigate to next
function navigateNext() {
    if (currentIndex < availableFolders.length - 1) {
        const newFolder = availableFolders[currentIndex + 1];
        loadCanvas(newFolder, 'next');
    }
}

// Navigate to specific folder
function navigateToFolder(folderNum) {
    if (availableFolders.includes(folderNum)) {
        // Determine direction for animation based on current and target index
        const targetIndex = availableFolders.indexOf(folderNum);
        const direction = targetIndex > currentIndex ? 'next' : 'prev';
        loadCanvas(folderNum, direction);
    } else {
        // If folder doesn't exist, go back to current valid folder
        currentNum.value = availableFolders[currentIndex];
    }
}

// Event listeners
prevBtn.addEventListener('click', navigatePrev);
nextBtn.addEventListener('click', navigateNext);

// Input field handling
currentNum.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const inputValue = e.target.value.padStart(2, '0');
        navigateToFolder(inputValue);
    }
});

// Only allow numbers in input
currentNum.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value.length > 2) {
        e.target.value = e.target.value.slice(0, 2);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigatePrev();
    if (e.key === 'ArrowRight') navigateNext();
    if (e.key === 'Home') {
        e.preventDefault(); // Prevent default browser behavior (e.g., scrolling to top)
        showDefault();
    }
});

// Initialize
(async () => {
    availableFolders = await detectFolders();
    // Ensure currentIndex is valid if 00 is not the first detected folder
    if (availableFolders.includes('00')) {
        currentIndex = availableFolders.indexOf('00');
    } else {
        currentIndex = 0; // Default to the first available folder if 00 isn't found
    }
    updateNavigation();
    showDefault(); // Load the default (00) page initially
    console.log('Detected folders:', availableFolders);
})();
