
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.getElementById('equals-button'); // Corrected ID
const clearButton = document.getElementById('clear-button'); // Corrected ID
const decimalButton = document.getElementById('decimal');

function updateDisplay() {
    display.textContent = currentInput === '' ? '0' : currentInput;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    if (number === '.' && currentInput.includes('.')) return;
    currentInput += number;
    updateDisplay();
}

function chooseOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        calculate();
    }
    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
}

function clear() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function calculate() {
    if (previousInput === '' || currentInput === '' || operator === null) return;

    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.textContent = "Error";
                currentInput = '';
                previousInput = '';
                operator = null;
                shouldResetDisplay = true;
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    currentInput = computation.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperator(button.textContent);
    });
});

equalsButton.addEventListener('click', () => {
    calculate();
});

clearButton.addEventListener('click', () => {
    clear();
});

decimalButton.addEventListener('click', () => {
    appendNumber('.');
});

// Initial display update
updateDisplay();
