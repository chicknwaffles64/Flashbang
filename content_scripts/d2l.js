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
    const { savedColorsD2L } = await browser.storage.local.get("savedColorsD2L");
    if (savedColorsD2L && savedColorsD2L.length > 0) {
        saveColors(savedColorsD2L);
    }
}
// Load the saved colors when the content script runs
loadColors();