const celsiusEl = document.getElementById("celsius");
const fahrenheitEl = document.getElementById("fahrenheit");
const kelvinEl = document.getElementById("kelvin");
const mercury = document.getElementById("mercury");
const bulb = document.getElementById("bulb");
const root = document.documentElement;

const KELVIN_OFFSET = 273.15;
const gauges = {
    celsius: document.getElementById("gauge-c"),
    fahrenheit: document.getElementById("gauge-f"),
    kelvin: document.getElementById("gauge-k"),
};

function updateVisual(celsiusValue) {
    const min = -40, max = 150;
    const t = Math.min(1, Math.max(0, (celsiusValue - min) / (max - min)));
    mercury.style.height = (6 + t * 94) + "%";
    const hue = 215 - t * 210; // 215 (cool blue) -> 5 (hot red)
    root.style.setProperty("--hue", hue.toFixed(0));
}

function computeTemp(event) {
    const currentValue = +event.target.value;
    if (event.target.value === "" || Number.isNaN(currentValue)) return;

    let celsiusValue;
    switch (event.target.name) {
        case "celsius":
            celsiusValue = currentValue;
            kelvinEl.value = (currentValue + KELVIN_OFFSET).toFixed(2);
            fahrenheitEl.value = (currentValue * 1.8 + 32).toFixed(2);
            break;
        case "fahrenheit":
            celsiusValue = (currentValue - 32) / 1.8;
            celsiusEl.value = celsiusValue.toFixed(2);
            kelvinEl.value = (celsiusValue + KELVIN_OFFSET).toFixed(2);
            break;
        case "kelvin":
            celsiusValue = currentValue - KELVIN_OFFSET;
            celsiusEl.value = celsiusValue.toFixed(2);
            fahrenheitEl.value = (celsiusValue * 1.8 + 32).toFixed(2);
            break;
        default:
            return;
    }
    updateVisual(celsiusValue);
}

[celsiusEl, fahrenheitEl, kelvinEl].forEach((el) => {
    el.setAttribute("name", el.id);
    el.addEventListener("input", computeTemp);
    el.addEventListener("focus", () => gauges[el.id].classList.add("focused"));
    el.addEventListener("blur", () => gauges[el.id].classList.remove("focused"));
});

// Initialize with room temperature
celsiusEl.value = "22";
computeTemp({ target: { name: "celsius", value: "22" } });

// 3D tilt on pointer move (skip on touch / reduced motion)
const stage = document.getElementById("stage");
const panel = document.getElementById("panel");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    stage.addEventListener("mousemove", (e) => {
        const rect = stage.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (px - 0.5) * 14;
        const ry = -(py - 0.5) * 14;
        panel.style.setProperty("--rx", rx.toFixed(2) + "deg");
        panel.style.setProperty("--ry", ry.toFixed(2) + "deg");
    });
    stage.addEventListener("mouseleave", () => {
        panel.style.setProperty("--rx", "0deg");
        panel.style.setProperty("--ry", "0deg");
    });
}