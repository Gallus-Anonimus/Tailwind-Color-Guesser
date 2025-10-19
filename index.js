const colorBox = document.getElementById("color-box");
const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const streakCountEl = document.getElementById("streak-count");
const toggleColorsBtn = document.getElementById("toggle-colors-btn");
const allColorsContainer = document.getElementById("all-colors-container");
const clickInstruction = document.getElementById("click-instruction");
const datalist = document.getElementById("color-options");
const colorNames = ["slate","gray","zinc","neutral","stone","red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose",];
const shades = ["50","100","200","300","400","500","600","700","800","900",];
let currentColor = "";
let streak = 0;


function pickRandomColor() {
    const randomColor =
        colorNames[Math.floor(Math.random() * colorNames.length)];


    const shades2 = ["50","100","100","200","200","300","300","400","400","500","500","600","600","700","700","800","800","900","900"];
    const randomShade = shades2[Math.floor(Math.random() * shades2.length)];

    return `${randomColor}-${randomShade}`;
}

function setColor(color) {
    currentColor = color;
    colorBox.className = "w-48 h-48 rounded-lg shadow-lg mb-6";
    colorBox.classList.add(`bg-${color}`);
}

function normalizeInput(input) {
    return input.trim().toLowerCase();
}

function handleColorGuess(guess) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (guess === currentColor) {
        streak++;
        streakCountEl.textContent = streak;
        feedback.textContent = "Correct!";
        feedback.classList.remove("text-red-600");
        feedback.classList.add("text-green-400");
        guessInput.disabled = true;
        guessInput.value = "";

        nextBtn.classList.remove("hidden");
        return;
    }

    const [guessColor, guessShade] = splitColorShade(guess);
    const [correctColor, correctShade] = splitColorShade(currentColor);

    if (guessColor === correctColor && guessShade !== correctShade) {
        feedback.textContent = "Color name is correct, but shade is wrong.";
    } else if (guessShade === correctShade && guessColor !== correctColor) {
        feedback.textContent = "Shade is correct, but color name is wrong.";
    } else {
        feedback.textContent = "Try again!";
    }

    streak = 0;
    streakCountEl.textContent = streak;
    feedback.classList.remove("text-green-400");
    feedback.classList.add("text-red-600");
}

function splitColorShade(str) {
    const parts = str.split("-");
    if (parts.length < 2) return [str, ""];
    const shade = parts.pop();
    const colorName = parts.join("-");
    return [colorName, shade];
}

function startNewRound() {
    feedback.textContent = "";
    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.focus();
    nextBtn.classList.add("hidden");

    const newColor = pickRandomColor();
    setColor(newColor);
}

guessForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const guessRaw = guessInput.value;
    const guess = normalizeInput(guessRaw);
    handleColorGuess(guess);
});

nextBtn.addEventListener("click", () => {
    startNewRound();
});

toggleColorsBtn.addEventListener("click", () => {
    if (allColorsContainer.classList.contains("hidden")) {
        allColorsContainer.classList.remove("hidden");
        clickInstruction.classList.remove("hidden");
        toggleColorsBtn.textContent = "Hide All Available Colors";
    } else {
        allColorsContainer.classList.add("hidden");
        clickInstruction.classList.add("hidden");
        toggleColorsBtn.textContent = "Show All Available Colors";
    }
});


allColorsContainer.addEventListener("click", (e) => {
    const colorSquare = e.target.closest('[data-color]');
    if (colorSquare && !guessInput.disabled) {
        const clickedColor = colorSquare.dataset.color;
        handleColorGuess(clickedColor);
    }
});


function populateAllColors() {
    const colors = [];
    for (const color of colorNames) {
        for (const shade of shades) {
            colors.push(`${color}-${shade}`);
        }}

    colors.forEach((color) => {
        const colorDiv = document.createElement("div");
        colorDiv.className =
            `flex flex-col items-center justify-center cursor-pointer select-none hover:scale-105 transition-transform`;

        const square = document.createElement("div");
        square.className = `w-10 h-10 rounded shadow-sm mb-1 bg-${color} border border-gray-700 hover:border-gray-500 transition-colors`;
        square.title = `Click to guess: ${color}`;
        square.dataset.color = color;

        const label = document.createElement("div");
        label.className = "text-xs text-center text-gray-200";
        label.textContent = color;

        colorDiv.appendChild(square);
        colorDiv.appendChild(label);
        allColorsContainer.appendChild(colorDiv);
    });
}


function populateDatalist() {
    const colors = [];
    for (const color of colorNames) {
        for (const shade of shades) {
            colors.push(`${color}-${shade}`);
        }}

    colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        datalist.appendChild(option);
    });
}


populateAllColors();
populateDatalist();
startNewRound();
