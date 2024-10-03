function saveColors(colors) {
    const style = document.createElement('style');
    
    style.textContent = `
    :root { 
        --hue1: ${colors[0][0]} !important;
        --hue2: ${colors[0][1]} !important; 
        --hue3: ${colors[0][2]} !important; 
        }
    `;
    document.head.appendChild(style);
}

// Load the saved colors from storage
async function loadColors() {
    const { savedColors } = await browser.storage.local.get("savedColors");
    if (savedColors && savedColors.length > 0) {
        saveColors(savedColors);
    }
}

// Load the saved colors when the content script runs
loadColors();