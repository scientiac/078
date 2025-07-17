// DOM elements
const iframeGallery = document.getElementById('iframeGallery');

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
        // Optionally, sort the folders numerically for consistent display
        uniqueFolders.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        return uniqueFolders;
    } catch (e) {
        console.error('Error reading public-canvas.txt', e);
        return ['00']; // Fallback in case of any error
    }
}
// --- END MODIFIED detectFolders function ---

// Function to dynamically create and add iframe cards to the gallery
async function populateGallery() {
    // Show loading message initially
    iframeGallery.innerHTML = '<div class="loading-message inconsolata">Loading canvases...</div>';

    const availableFolders = await detectFolders();
    iframeGallery.innerHTML = ''; // Clear loading message

    if (availableFolders.length === 0) {
        iframeGallery.innerHTML = '<div class="loading-message inconsolata">No canvases found.</div>';
        return;
    }

    // Create an iframe card for each detected folder
    availableFolders.forEach(folderNum => {
        // Create the main card container for the iframe
        const iframeCard = document.createElement('div');
        iframeCard.classList.add('iframe-card');

        // Create a div for the title of the iframe
        const iframeTitle = document.createElement('div');
        iframeTitle.classList.add('iframe-title', 'inconsolata');
        iframeTitle.textContent = `Canvas ${folderNum}`; // Default title

        // Create the iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `${folderNum}/index.html`;
        iframe.setAttribute('loading', 'lazy'); // Optimize loading for off-screen iframes

        // Listen for the iframe to load to get its title
        iframe.onload = () => {
            try {
                // Attempt to access the iframe's contentDocument to get its title
                // This might be blocked by CORS if the iframe content is from a different origin
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && iframeDoc.title) {
                    iframeTitle.textContent = iframeDoc.title;
                }
            } catch (e) {
                // Log CORS or other access errors, but don't break the page
                console.warn(`Could not access iframe content for folder ${folderNum}:`, e);
                // Keep the default title if access is denied
            }
        };

        // Append the title and iframe to the card
        iframeCard.appendChild(iframeTitle);
        iframeCard.appendChild(iframe);

        // Append the card to the gallery container
        iframeGallery.appendChild(iframeCard);
    });
}

// Initialize the gallery on page load
window.onload = populateGallery;
