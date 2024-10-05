function saveColors(colors) {
    const style = document.createElement('style');
    
    style.textContent = `
    :root { 
        --hue1: ${colors[2][0]} !important;
        --hue2: ${colors[2][1]} !important; 
        --hue3: ${colors[2][2]} !important; 
        }
    `;
    document.head.appendChild(style);
}

// Load the saved colors from storage
async function loadColors() {
    chrome.storage.local.get(['savedColors'], function(result) {
        const savedColors = result.savedColors || [];
        if (savedColors && savedColors.length > 0) {
            saveColors(savedColors);
        }
    });
}

// Load the saved colors when the content script runs
loadColors();