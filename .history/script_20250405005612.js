document.addEventListener('DOMContentLoaded', () => {
    const collageContainer = document.getElementById('collage-container');

    // Function to fetch image data
    async function fetchImageData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const images = await response.json();
            loadCollageImages(images);
        } catch (error) {
            console.error('Could not fetch image data:', error);
            // Optionally display an error message to the user
            if (collageContainer) {
                 collageContainer.innerHTML = '<p>Error loading images. Please try again later.</p>';
            }
        }
    }

    function loadCollageImages(images) {
        if (!collageContainer) {
            console.error('Collage container not found!');
            return;
        }
        collageContainer.innerHTML = ''; // Clear existing content

        images.forEach(imageData => {
            const link = document.createElement('a');
            link.href = imageData.siteUrl;
            link.target = '_blank'; // Open link in a new tab
            link.rel = 'noopener noreferrer';
            link.classList.add('collage-item');

            const img = document.createElement('img');
            img.src = imageData.imageUrl;
            img.alt = `Preview of ${imageData.siteName}`;
            img.loading = 'lazy'; // Lazy load images

            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = imageData.siteName;

            link.appendChild(img);
            link.appendChild(tooltip);
            collageContainer.appendChild(link);
        });
    }

    // Fetch and load the images
    fetchImageData();


    // --- Form Handling --- 
    const uploadForm = document.getElementById('upload-form');
    const siteNameInput = document.getElementById('siteName');
    const siteUrlInput = document.getElementById('siteUrl');
    const imageFileInput = document.getElementById('imageFile');

    if (uploadForm) {
        uploadForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const siteName = siteNameInput.value.trim();
            const siteUrl = siteUrlInput.value.trim();
            const imageFile = imageFileInput.files[0];

            if (!siteName || !siteUrl || !imageFile) {
                alert('Please fill in all fields and select an image.');
                return;
            }

            // Simulate adding to collage (no actual upload/save)
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImageData = {
                    // Assign a temporary ID or handle ID generation properly in a real backend
                    id: Date.now(), 
                    imageUrl: e.target.result, // Use the read file data as URL
                    siteUrl: siteUrl,
                    siteName: siteName
                };

                // Add the new item visually to the collage
                addImageToCollage(newImageData);

                // Clear the form
                uploadForm.reset(); 
            }
            reader.readAsDataURL(imageFile); // Read the file as a Data URL

        });
    }

    // Helper function to add a single image item to the collage
    function addImageToCollage(imageData) {
         if (!collageContainer) return;

         const link = document.createElement('a');
         link.href = imageData.siteUrl;
         link.target = '_blank';
         link.rel = 'noopener noreferrer';
         link.classList.add('collage-item');

         const img = document.createElement('img');
         img.src = imageData.imageUrl;
         img.alt = `Preview of ${imageData.siteName}`;
         img.loading = 'lazy'; 

         const tooltip = document.createElement('span');
         tooltip.classList.add('tooltip');
         tooltip.textContent = imageData.siteName;

         link.appendChild(img);
         link.appendChild(tooltip);
         collageContainer.appendChild(link); // Append the new item
    }


    // TODO: Implement image upload functionality
    // TODO: Implement data persistence (saving/loading image data)
    // TODO: Implement the embeddable widget
    // TODO: Implement the optional 3D view
});