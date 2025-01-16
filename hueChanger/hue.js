function rgbToHsl(rgbString) {
    // Normalize the RGB values to the range [0, 1]
    rgbString = rgbString.replace('rgb(', '').replace(')', '').split(', ')
    r = Number(rgbString[0]) / 255 
    g = Number(rgbString[1]) / 255
    b = Number(rgbString[2]) / 255

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Calculate Lightness
    let h, s, l = (max + min) / 2;

    // Calculate Saturation
    if (delta === 0) {
        h = s = 0; // achromatic
    } else {
        s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);

        // Calculate Hue
        switch (max) {
            case r:
                h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
                break;
            case g:
                h = ((b - r) / delta + 2) * 60;
                break;
            case b:
                h = ((r - g) / delta + 4) * 60;
                break;
        }
    }

    // Convert values to the correct format
    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return {
        H: h,
        LS: `${s}%, ${l}%`,
        string: `hsl(${h}, ${s}%, ${l}%)`
    };
}

const OG = {
    drive: {
        H : [211, 207, 229],
        LS: ["19%, 12%", "32%, 14%", "17%, 40%"]
    },
    docs: {
        H : [257, 240, 192],
        LS: ["98%, 77%", "50%, 75%", "100%, 50%"]
    },
    D2L: {
        H : [204, 264, 260],
        LS : ["100%, 71%", "68%, 50%", "34%, 15%"]
    }
}
let colors = {
    drive: {
        H : [211, 207, 229],
        LS: ["19%, 12%", "32%, 14%", "17%, 40%"]
    },
    docs: {
        H : [257, 240, 192],
        LS: ["98%, 77%", "50%, 75%", "100%, 50%"]
    },
    D2L: {
        H : [210, 199, 161],
        LS : ["82%, 85%", "100%, 71%", "47%, 70%"]
    }
}

// Load the saved colors from storage
document.addEventListener('DOMContentLoaded', async () => {
    const { savedColors } = await browser.storage.local.get("savedColors");
    if (savedColors && savedColors.length > 1) {
        //set toggle switch first
        if (savedColors[1][1] == 'hsl(0, 0%, 13%)') document.getElementById('check').checked = 'checked'

        let k = 0;
        Object.keys(colors).forEach(website => {
            document.querySelectorAll(`.${website}`).forEach(box => {
                if (k > 2) return;
                let hsl = {}
                switch(website) {
                    case 'drive':
                        hsl = rgbToHsl(savedColors[0][k])
                        colors.drive.H[k] = hsl.H
                        colors.drive.LS[k] = hsl.LS
                        break;
                    case 'docs':
                        if (k == 1) {
                            hsl = rgbToHsl(savedColors[1][5])
                            colors.docs.H[k] = hsl.H
                            colors.docs.LS[k] = hsl.LS
                            break
                        }

                        hsl = rgbToHsl(savedColors[1][k])
                        colors.docs.H[k] = hsl.H
                        colors.docs.LS[k] = hsl.LS
                        break;
                    case 'D2L':
                        hsl = rgbToHsl(savedColors[2][k])
                        colors.D2L.H[k] = hsl.H
                        colors.D2L.LS[k] = hsl.LS
                        break;
                    }
                box.style.backgroundColor = hsl.string
                document.documentElement.style.setProperty(`--color${k+1}-${website}`, hsl.string)
                k++
            });
            k = 0
        });
    }
    slider.value = colors.drive.H[0]
  });

const buttonDiv = document.getElementById('buttonDiv')
const slider = document.getElementById('slider')
let selectedBox = document.querySelector('.selected')
let selectedBoxNum = 0
let oldSliderValue = 0;

let H = colors.drive.H[0]
let LS = colors.drive.LS[0]

document.getElementById('colorOuter').addEventListener('click', (e) => {

    if (e.target.classList.contains('toggle')) return
    
    if (!e.target.classList.contains('selected')) {
        document.querySelectorAll('COLORBLOCK').forEach (div => {
            div.classList.remove('selected')
        })
        e.target.classList.add('selected')
        selectedBox = document.querySelector('.selected')
        selectedBoxNum = Number(e.target.id.slice(2,3)) - 1

        switch (e.target.id.slice(4,)) {
            case 'drive':
                H = colors.drive.H[selectedBoxNum]
                LS = colors.drive.LS[selectedBoxNum]
                break;
            case 'docs':
                H = colors.docs.H[selectedBoxNum]
                LS = colors.docs.LS[selectedBoxNum]
                break;
            case 'D2L':
                H = colors.D2L.H[selectedBoxNum]
                LS = colors.D2L.LS[selectedBoxNum]
                break;
        }
    }
    slider.value = H
});

slider.addEventListener('input', () => {
    
    selectedBox.style.backgroundColor = `hsl(${slider.value}, ${LS})`
});

buttonDiv.addEventListener('click', (e) => {
    if (e.target.id == 'save') {
        // SAVE COLORS TO LOCAL STORAGE //
    let colorsExport = []
    let j = 0; let colorsArray = [];
    
    Object.keys(colors).forEach(website => {
        document.querySelectorAll(`.${website}`).forEach(box => {
            colorsArray.push(window.getComputedStyle(box).getPropertyValue("background-color"))
            j++
        });
        colorsExport.push(colorsArray); 
        j = 0; colorsArray = []
    })
    //for transparent color - specifically google docs
    if (colorsExport[1][2].length > 1) {
        colorsExport[1][2] = colorsExport[1][2].replace("%", "").replace(")", ", 0.2)")
    }
    //for black filter - google docs
    const checkbox = document.getElementById('check')
    if (checkbox.checked) {
        colorsExport[1][5] = colorsExport[1][1] //save in memory
        colorsExport[1][1] = 'hsl(0, 0%, 13%)'
        colorsExport[1][3] = 'rgb(220, 220, 220)'
        colorsExport[1][4] = 'invert()'

    }
    else { 
        colorsExport[1][3] = 'rgb(32, 32, 32)'
        colorsExport[1][4] = 'none'
        colorsExport[1][5] = colorsExport[1][1]
    }


    browser.storage.local.set({ savedColors: colorsExport }).then(() => {
        document.getElementById('message').textContent = "Color schemes saved!\r\nReload your webpages to see the changes.";
        setTimeout(() => {
            document.getElementById('message').textContent = "";
        }, 2500);
    })
    } 
    else if (e.target.id == 'reset') {
        let k = 0;

        Object.keys(colors).forEach(website => {
        document.querySelectorAll(`.${website}`).forEach(box => {
            let oldHue = ""
            switch(website) {
                case 'drive':
                    oldHue = `hsl(${OG.drive.H[k]}, ${OG.drive.LS[k]})`
                    break;
                case 'docs':
                    oldHue = `hsl(${OG.docs.H[k]}, ${OG.docs.LS[k]})`
                    break;
                case 'D2L':
                    oldHue = `hsl(${OG.D2L.H[k]}, ${OG.D2L.LS[k]})`
                    break;
                }
            box.style.backgroundColor = oldHue
            document.documentElement.style.setProperty(`--color${k+1}-${website}`, oldHue)
            slider.value = 0
            k++
        });
        k = 0;
    })
    }
    else { return }
});