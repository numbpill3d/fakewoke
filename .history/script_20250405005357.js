document.addEventListener('DOMContentLoaded', () => {
    const collageContainer = document.getElementById('collage-container');

    // Sample data - replace with actual data fetching later (e.g., from a JSON file or API)
    const sampleImages = [
        { id: 1, imageUrl: 'https://via.placeholder.com/100/FF0000/FFFFFF?text=Site1', siteUrl: 'https://example.com/site1', siteName: 'Example Site 1' },
        { id: 2, imageUrl: 'https://via.placeholder.com/100/00FF00/FFFFFF?text=Site2', siteUrl: 'https://example.com/site2', siteName: 'Example Site 2' },
        { id: 3, imageUrl: 'https://via.placeholder.com/100/0000FF/FFFFFF?text=Site3', siteUrl: 'https://example.com/site3', siteName: 'Example Site 3' },
        { id: 4, imageUrl: 'https://via.placeholder.com/100/FFFF00/000000?text=Site4', siteUrl: 'https://example.com/site4', siteName: 'Example Site 4' },
        { id: 5, imageUrl: 'https://via.placeholder.com/100/FF00FF/FFFFFF?text=Site5', siteUrl: 'https://example.com/site5', siteName: 'Example Site 5' },
        { id: 6, imageUrl: 'https://via.placeholder.com/100/00FFFF/000000?text=Site6', siteUrl: 'https://example.com/site6', siteName: 'Example Site 6' },
        { id: 7, imageUrl: 'https://via.placeholder.com/100/FFA500/FFFFFF?text=Site7', siteUrl: 'https://example.com/site7', siteName: 'Example Site 7' },
        { id: 8, imageUrl: 'https://via.placeholder.com/100/800080/FFFFFF?text=Site8', siteUrl: 'https://example.com/site8', siteName: 'Example Site 8' },
        { id: 9, imageUrl: 'https://via.placeholder.com/100/4682B4/FFFFFF?text=Site9', siteUrl: 'https://example.com/site9', siteName: 'Example Site 9' },
        { id: 10, imageUrl: 'https://via.placeholder.com/100/D2691E/FFFFFF?text=Site10', siteUrl: 'https://example.com/site10', siteName: 'Example Site 10' },
        // Add more sample images as needed
    ];

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

    // Load the sample images
    loadCollageImages(sampleImages);

    // TODO: Implement image upload functionality
    // TODO: Implement data persistence (saving/loading image data)
    // TODO: Implement the embeddable widget
    // TODO: Implement the optional 3D view
});