document.addEventListener('DOMContentLoaded', () => {
    const widgetLink = document.getElementById('widget-link');
    const widgetImage = document.getElementById('widget-image');
    const widgetTooltip = document.getElementById('widget-tooltip');
    const widgetContainer = document.getElementById('widget-container'); // For error display

    let images = [];
    let currentIndex = 0;
    let intervalId = null;
    const cycleInterval = 5000; // Change image every 5 seconds

    // Function to update the widget display
    function updateWidget() {
        if (!images.length || !widgetLink || !widgetImage || !widgetTooltip) {
            // Stop interval if elements are missing or no images
            if(intervalId) clearInterval(intervalId); 
            return;
        }

        // Cycle through images
        currentIndex = (currentIndex + 1) % images.length;
        const currentImage = images[currentIndex];

        widgetImage.src = currentImage.imageUrl;
        widgetImage.alt = `Preview of ${currentImage.siteName}`;
        widgetLink.href = currentImage.siteUrl;
        widgetTooltip.textContent = currentImage.siteName;
    }

    // Function to fetch image data for the widget
    async function fetchImageDataForWidget() {
        try {
            // Assuming widget.html is in the same directory as data.json
            // Adjust the path if the widget will be embedded elsewhere and needs a full URL
            const response = await fetch('data.json'); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            images = await response.json();

            if (images.length > 0) {
                // Initial display
                currentIndex = Math.floor(Math.random() * images.length); // Start with a random image
                updateWidget(); 
                
                // Start cycling only if there's more than one image
                if (images.length > 1) {
                   intervalId = setInterval(updateWidget, cycleInterval);
                }
            } else {
                 displayError("No images found.");
            }

        } catch (error) {
            console.error('Widget could not fetch image data:', error);
            displayError("Error loading data.");
            // Stop interval on error
             if(intervalId) clearInterval(intervalId);
        }
    }

    function displayError(message) {
        if (widgetContainer) {
            widgetContainer.innerHTML = `<p style="text-align: center; padding: 10px; color: red;">${message}</p>`;
        }
    }

    // Fetch data and start the widget
    fetchImageDataForWidget();
});