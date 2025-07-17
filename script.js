// DOM elements
const iframeGallery = document.getElementById('iframeGallery');
const themeColorMeta = document.querySelector('meta[name="theme-color"]'); // Get the theme-color meta tag
const htmlElement = document.documentElement; // Get the html element for background color update

// Function to update the theme-color meta tag and html background based on iframe's body background
function updateThemeColor(iframe) {
    // Check if the theme-color meta tag exists in the document.
    // If it doesn't, log a warning and exit the function, as we cannot update it.
    if (!themeColorMeta) {
        console.warn("Theme color meta tag not found. Cannot update browser theme color.");
        return;
    }

    try {
        // Attempt to access the iframe's contentDocument.
        // This is crucial for reading the styles of the content loaded inside the iframe.
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Ensure that the iframe document and its body element are accessible.
        // If either is null or undefined, we cannot proceed.
        if (iframeDoc && iframeDoc.body) {
            // Get the computed style of the iframe's body.
            // This gives us the actual, rendered style properties, including background color.
            const computedStyle = getComputedStyle(iframeDoc.body);
            let bgColor = computedStyle.backgroundColor;

            // If the body's background color is transparent (either 'rgba(0, 0, 0, 0)' or 'transparent'),
            // it means the background might be set on the html element within the iframe.
            // In such cases, try to get the background color from the iframe's html element instead.
            if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                const htmlComputedStyle = getComputedStyle(iframeDoc.documentElement);
                bgColor = htmlComputedStyle.backgroundColor;
            }

            // Finally, if a valid (non-transparent) background color is found,
            // update the 'content' attribute of the theme-color meta tag.
            // This changes the browser's theme color (e.g., in macOS Safari, Android Chrome).
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                themeColorMeta.setAttribute('content', bgColor);
                // Also set the main html element's background color to match
                htmlElement.style.backgroundColor = bgColor;
            }
        }
    } catch (e) {
        // This catch block is vital for handling potential CORS (Cross-Origin Resource Sharing) issues.
        // If the iframe content is from a different domain, security policies prevent direct access to its document.
        // In such cases, the theme color and html background will not be updated by this specific iframe,
        // and the browser will retain its current theme color.
        console.warn("Could not access iframe content for theme color:", e);
    }
}

// Intersection Observer to detect which iframe is currently most in view.
// This observer will trigger a callback function whenever an observed element
// (in this case, an 'iframe-card') enters or exits the viewport, or changes
// its intersection ratio (how much of it is visible) significantly.
const observer = new IntersectionObserver((entries) => {
    let mostVisibleIframe = null; // Variable to store the iframe that has the highest visibility.
    let maxRatio = 0; // Tracks the highest intersection ratio found among observed elements.

    // Iterate over all 'entries' provided by the Intersection Observer.
    // Each 'entry' represents a change in intersection status for one of the observed elements.
    entries.forEach(entry => {
        // If an observed element is currently intersecting the viewport
        // AND its 'intersectionRatio' (a value from 0 to 1, indicating visibility percentage)
        // is greater than the 'maxRatio' found so far, then this element is the new 'most visible'.
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            // Get the actual iframe element nested inside the 'iframe-card' div.
            mostVisibleIframe = entry.target.querySelector('iframe');
        }
    });

    // If a 'most visible' iframe was successfully identified in the current observer callback cycle.
    if (mostVisibleIframe) {
        // Before attempting to get the background color, check if the iframe's content
        // (its document and body) has fully loaded. This prevents errors if the observer
        // fires before the iframe's content is ready.
        if (mostVisibleIframe.contentDocument && mostVisibleIframe.contentDocument.body) {
             updateThemeColor(mostVisibleIframe);
        } else {
            // If the iframe content is not yet loaded, attach an 'onload' listener to it.
            // This ensures that 'updateThemeColor' is called once the iframe's content is ready.
            // We use { once: true } to automatically remove the listener after it fires once,
            // preventing multiple calls for the same iframe.
            mostVisibleIframe.onload = () => {
                updateThemeColor(mostVisibleIframe);
            };
        }
    }
}, {
    // The 'threshold' option defines at what percentage of visibility the observer callback should fire.
    // A granular list (0.1 to 1.0) ensures that the callback is triggered frequently as the user scrolls,
    // allowing for smoother and more responsive updates to the theme color.
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
});

// Function to dynamically create and add iframe cards to the gallery.
async function populateGallery() {
    // Call the 'detectFolders' helper function to get the list of available student folders.
    const availableFolders = await detectFolders();
    iframeGallery.innerHTML = ''; // Clear the loading message once folders are detected.

    // If no folders are found (e.g., 'public-canvas.txt' is empty or unreadable),
    // display a message indicating that no canvases were found.
    if (availableFolders.length === 0) {
        iframeGallery.innerHTML = '<div class="loading-message inconsolata">No canvases found.</div>';
        return;
    }

    // Iterate over each detected folder to dynamically create an 'iframe-card' for it.
    availableFolders.forEach((folderNum, index) => {
        // Create a new div element that will serve as the container for each iframe.
        const iframeCard = document.createElement('div');
        iframeCard.classList.add('iframe-card'); // Apply CSS styles defined for iframe cards.
        iframeCard.dataset.folder = folderNum; // Store the folder number as a data attribute for easy reference.

        // Create the iframe element itself.
        const iframe = document.createElement('iframe');
        iframe.src = `${folderNum}/index.html`; // Set the source URL for the iframe to the student's index.html.
        iframe.setAttribute('loading', 'lazy'); // Enable lazy loading for performance optimization.
                                                // This means iframes not currently in view will load later.

        // Append the iframe to its card container.
        iframeCard.appendChild(iframe);
        // Append the completed iframe card to the main gallery container.
        iframeGallery.appendChild(iframeCard);

        // Start observing this newly created 'iframeCard' with the Intersection Observer.
        // This allows the observer to track its visibility as the user scrolls.
        observer.observe(iframeCard);

        // Attach an 'onload' event listener to the iframe.
        // This ensures that we only attempt to read the iframe's content (like its background color)
        // once the iframe's content has fully loaded and rendered.
        iframe.onload = () => {
            // For the very first iframe in the list (index 0), immediately update the theme color.
            // This ensures the browser's theme color is set as soon as the initial content is ready.
            if (index === 0) {
                updateThemeColor(iframe);
            }
            // For subsequent iframes, the Intersection Observer will primarily handle updating the theme color
            // as they scroll into view and become the 'most visible' element.
        };
    });
}

// Initialize the gallery when the entire window (including all assets) finishes loading.
window.onload = populateGallery;

// Helper function to detect available student folders by reading 'public-canvas.txt'.
// This function remains largely the same as in previous versions, responsible for parsing the text file.
async function detectFolders() {
    try {
        const response = await fetch('public-canvas.txt');
        // Check if the network response was successful.
        if (!response.ok) {
            console.error('Failed to load public-canvas.txt:', response.statusText);
            return ['00']; // Fallback to only '00' if the file is not found or an error occurs.
        }
        const text = await response.text();
        // Split the text content by commas, trim any leading/trailing whitespace from each entry,
        // and filter out any empty strings that might result from multiple commas.
        const folders = text.split(',').map(folder => folder.trim()).filter(folder => folder !== '');
        // Create a unique list of folders using a Set, and ensure '00' is always included.
        const uniqueFolders = [...new Set(['00', ...folders])];
        // Sort the folders numerically for consistent display order in the gallery.
        uniqueFolders.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        return uniqueFolders;
    } catch (e) {
        // Catch any errors that occur during the fetch operation or text processing.
        console.error('Error reading public-canvas.txt', e);
        return ['00']; // Fallback to '00' in case of any error.
    }
}
