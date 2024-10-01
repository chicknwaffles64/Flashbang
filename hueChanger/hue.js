// Load the saved colors from storage
document.addEventListener('DOMContentLoaded', async () => {
    const { savedColorsDrive } = await browser.storage.local.get("savedColorsDrive");
    if (savedColorsDrive && savedColorsDrive.length > 0) {
      colors = savedColorsDrive;
    }
    const { savedColorsD2L } = await browser.storage.local.get("savedColorsD2L");
    if (savedColorsD2L && savedColorsD2L.length > 0) {
      colors = savedColorsD2L;
    }
  });

const buttonDiv = document.getElementById('buttonDiv')


const colorBoxesDrive = document.querySelectorAll('.drive')
const sliderDrive = document.getElementById('sliderDrive')
let oldSliderValueDrive = 0;
const huesDrive = [171, 171, 152]
const lightnessSatDrive = ["51%, 14%", "40%, 17%", "22%, 35%"]


const colorBoxesD2L = document.querySelectorAll('.D2L')
const sliderD2L = document.getElementById('sliderD2L')
let oldSliderValueD2L = 0;
const huesD2L = [204, 221, 264]
const lightnessSatD2L = ["100%, 71%", "85%, 82%", "68%, 50%"]


async function setColor(slider, oldSliderValue, hues, lightnessSat, colorBoxes) {
    const hue = slider.value;
    console.log(hue)
    let i = 0;
    colorBoxes.forEach(box => {
        let changeInSliderValue = hue - oldSliderValue   //records the change in slider value
        let newHue = (changeInSliderValue + hues[i])%360 //deals with hue values > 360 and values < 0
        box.style.backgroundColor = `hsl(${newHue}, ${lightnessSat[i]})`
        i++
    });
}

sliderDrive.addEventListener('input', () => {
    setColor(sliderDrive, oldSliderValueDrive, huesDrive, lightnessSatDrive, colorBoxesDrive)
});
sliderD2L.addEventListener('input', () => {
    setColor(sliderD2L, oldSliderValueD2L, huesD2L, lightnessSatD2L, colorBoxesD2L)
});

buttonDiv.addEventListener('click', (e) => {
    if (e.target.id == 'save') {

    } 
    else if (e.target.id == 'reset') {
        let k = 0;
        colorBoxesDrive.forEach(box => {
            let oldHue = `hsl(${huesDrive[k]}, ${lightnessSatDrive[k]})`
            box.style.backgroundColor = oldHue
            document.documentElement.style.setProperty(`--color${k+1}-drive`, oldHue)
            sliderDrive.value = 0
            k++
        });

        k = 0;
        colorBoxesD2L.forEach(box => {
            let oldHue = `hsl(${huesD2L[k]}, ${lightnessSatD2L[k]})`
            box.style.backgroundColor = oldHue
            document.documentElement.style.setProperty(`--color${k+1}-D2L`, oldHue)
            sliderD2L.value = 0
            k++
            
        });
    }
    else { return }

    // SAVE COLORS TO LOCAL STORAGE //
    //DRIVE
    let j = 0; let colorsArray = [];
    colorBoxesDrive.forEach(box => {
        colorsArray.push(box.style.backgroundColor)
        j++
    });
    browser.storage.local.set({ savedColorsDrive: colorsArray }).then(() => {
        document.getElementById('message').textContent = "Color saved for Google Drive! ";
    })

    //D2L
    j = 0; colorsArray = [];
    colorBoxesD2L.forEach(box => {
        colorsArray.push(box.style.backgroundColor)
        j++
    });
    browser.storage.local.set({ savedColorsD2L: colorsArray }).then(() => {
        document.getElementById('message').textContent = "Color saved for Google Drive and D2L! ";
    })
    
});