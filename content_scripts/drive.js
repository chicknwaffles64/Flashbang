function saveColors(colors) {
    const style = document.createElement('style');
    style.textContent = `
    :root { 
        --hue1: ${colors[0]} !important;
        --hue2: ${colors[1]} !important; 
        --hue3: ${colors[2]} !important; 
        }
    `;
    document.head.appendChild(style);
}

// Load the saved colors from storage
async function loadColors() {
    const { savedColorsDrive } = await browser.storage.local.get("savedColorsDrive");
    if (savedColorsDrive && savedColorsDrive.length > 0) {
        saveColors(savedColorsDrive);
    }
}

// Load the saved colors when the content script runs
loadColors();