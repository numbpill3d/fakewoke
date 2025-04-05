document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const collageContainer = document.getElementById('collage-container');
    const listContainer = document.getElementById('list-container');
    const siteList = document.getElementById('site-list');
    const searchInput = document.getElementById('search-input');
    const toggleViewButton = document.getElementById('toggle-view-button');
    const uploadForm = document.getElementById('upload-form');
    const siteNameInput = document.getElementById('siteName');
    const siteUrlInput = document.getElementById('siteUrl');
    const imageFileInput = document.getElementById('imageFile');
    const windowContent = document.querySelector('.window-content'); // For error messages

    // --- State ---
    let allImageData = []; // Store all fetched/added image data
    let currentView = 'collage'; // 'collage' or 'list'

    // --- Initialization ---
    fetchImageData();

    // --- Event Listeners ---
    if (toggleViewButton) {
        toggleViewButton.addEventListener('click', toggleView);
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFormSubmit);
    }

    // --- Functions ---

    // Fetch initial data
    async function fetchImageData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allImageData = await response.json();
            renderViews(allImageData); // Initial render
        } catch (error) {
            console.error('Could not fetch image data:', error);
            displayError('Error loading site data. Please try again later.');
        }
    }

    // Render both views based on provided data
    function renderViews(dataToRender) {
        renderCollageView(dataToRender);
        renderListView(dataToRender);
        // Ensure the correct view is visible based on current state
        updateViewVisibility();
    }

    // Render the collage view
    function renderCollageView(images) {
        if (!collageContainer) return;
        collageContainer.innerHTML = ''; // Clear existing content
        images.forEach(imageData => {
            const link = document.createElement('a');
            link.href = imageData.siteUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.classList.add('collage-item');
            link.title = imageData.siteName; // Use title for default browser tooltip

            const img = document.createElement('img');
            img.src = imageData.imageUrl;
            img.alt = `Preview of ${imageData.siteName}`;
            img.loading = 'lazy';

            // Simple tooltip (optional, could rely on title)
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = imageData.siteName;

            link.appendChild(img);
            link.appendChild(tooltip);
            collageContainer.appendChild(link);
        });
    }

    // Render the list view
    function renderListView(images) {
        if (!siteList) return;
        siteList.innerHTML = ''; // Clear existing content
        images.forEach(imageData => {
            const li = document.createElement('li');

            const img = document.createElement('img');
            img.src = imageData.imageUrl;
            img.alt = `Preview of ${imageData.siteName}`;
            img.classList.add('list-preview');
            img.loading = 'lazy';

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('list-info');

            const link = document.createElement('a');
            link.href = imageData.siteUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = imageData.siteName;

            const urlSpan = document.createElement('span');
            // Display the URL slightly smaller or differently
            try {
                const url = new URL(imageData.siteUrl);
                urlSpan.textContent = url.hostname; // Display hostname for brevity
            } catch (e) {
                urlSpan.textContent = imageData.siteUrl; // Fallback to full URL if invalid
            }


            infoDiv.appendChild(link);
            infoDiv.appendChild(urlSpan);
            li.appendChild(img);
            li.appendChild(infoDiv);
            siteList.appendChild(li);
        });
         // Add message if list is empty after filtering
        if (images.length === 0 && searchInput && searchInput.value) {
             const li = document.createElement('li');
             li.textContent = 'No sites match your search.';
             li.style.justifyContent = 'center';
             siteList.appendChild(li);
        } else if (images.length === 0) {
             const li = document.createElement('li');
             li.textContent = 'No sites available.';
             li.style.justifyContent = 'center';
             siteList.appendChild(li);
        }
    }

    // Handle search input changes
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredData = allImageData.filter(item =>
            item.siteName.toLowerCase().includes(searchTerm) ||
            item.siteUrl.toLowerCase().includes(searchTerm)
        );
        renderViews(filteredData);
    }

    // Toggle between collage and list view
    function toggleView() {
        if (currentView === 'collage') {
            currentView = 'list';
            toggleViewButton.textContent = 'Switch to Collage View';
        } else {
            currentView = 'collage';
            toggleViewButton.textContent = 'Switch to List View';
        }
        updateViewVisibility();
    }

    // Update which container (collage or list) is visible
    function updateViewVisibility() {
        if (!collageContainer || !listContainer) return;
        if (currentView === 'collage') {
            collageContainer.classList.remove('view-hidden');
            collageContainer.classList.add('view-active');
            listContainer.classList.remove('view-active');
            listContainer.classList.add('view-hidden');
        } else {
            listContainer.classList.remove('view-hidden');
            listContainer.classList.add('view-active');
            collageContainer.classList.remove('view-active');
            collageContainer.classList.add('view-hidden');
        }
         // Ensure collage keeps its grid display when active
        if (collageContainer.classList.contains('view-active')) {
             collageContainer.style.display = 'grid';
        } else {
             collageContainer.style.display = 'none';
        }
         // Ensure list keeps its block display when active
         if (listContainer.classList.contains('view-active')) {
             listContainer.style.display = 'block';
        } else {
             listContainer.style.display = 'none';
        }
    }


    // Handle the form submission
    function handleFormSubmit(event) {
        event.preventDefault();

        const siteName = siteNameInput.value.trim();
        const siteUrl = siteUrlInput.value.trim();
        const imageFile = imageFileInput.files[0];

        if (!siteName || !siteUrl || !imageFile) {
            alert('Please fill in all fields and select an image.');
            return;
        }

        // Use FileReader to get image data URL for immediate display
        const reader = new FileReader();
        reader.onload = function(e) {
            const newImageData = {
                id: Date.now(), // Temporary ID
                imageUrl: e.target.result,
                siteUrl: siteUrl,
                siteName: siteName
            };

            // Add to the main data array
            allImageData.push(newImageData);

            // Re-render views with the updated data, applying current filter
            handleSearch();

            // Clear the form
            uploadForm.reset();

            // Optional: Provide user feedback
            // alert('Site added to the collage (locally)!');
        }
        reader.readAsDataURL(imageFile);
        // NOTE: In a real application, you would send this data to a server here
        // to persist it and get a proper image URL.
    }

     // Display error messages within the window content area
    function displayError(message) {
        if (windowContent) {
            // Clear existing views first
            if(collageContainer) collageContainer.innerHTML = '';
            if(siteList) siteList.innerHTML = '';
            // Display error
            const errorP = document.createElement('p');
            errorP.textContent = message;
            errorP.style.color = 'red';
            errorP.style.textAlign = 'center';
            errorP.style.padding = '20px';
            // Prepend error to the main content area
             windowContent.insertBefore(errorP, windowContent.firstChild);
        } else {
            console.error("Error display area not found.");
        }
    }

});