const keys = document.querySelector('.buttons');
const display = document.querySelector('.display');
const fncEditModal = document.querySelector('#fncEdit');
const fncEditClose = document.querySelector('#fncClose');
const fncEditConfirm = document.querySelector('#fncConfirm');
const fncDropdown = document.querySelector('#fncSelect');
const fncExpression = document.querySelector('#fncExpression');
const alertModal = document.querySelector('#alert');
let alertTimeout = null;

class Calculator{
    constructor(displayDiv) {
        this.inputA = '';
        this.inputB = '';
        this.op = '';
        this.display = displayDiv;

        this.methods = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        };
    };

    registerMethod(sym, fn) {
        this.methods[sym] = fn;
    };
    areInputsEmpty() {
        return { inputA: !this.inputA, inputB: !this.inputB, op: !this.op };
    };
    updateDisplay() {
        const MAX_CHARS = 14;
        let txt = this.inputB || this.inputA || '0';
        if(this.op && !this.inputB) txt = this.inputA;
        if(txt.length > MAX_CHARS) txt = '..' + txt.slice(-(MAX_CHARS - 2));
        this.display.textContent = txt;
    }
    inputNum(str) {
        const empties = this.areInputsEmpty();
        if(empties.op) {
            this.inputA += str;
            this.updateDisplay();
        } else {
            this.inputB += str;
            this.updateDisplay();
        }
    };
    inputOp(str) {
        const empties = this.areInputsEmpty();
        if (empties.inputA) return;
        if(!empties.inputA && !empties.op && !empties.inputB) {
            this.calculate();
            this.op = str;
        } else {
            this.op = str;
            this.updateDisplay();
        }
        
    };
    calculate() {
        if(!this.inputA || !this.op || !this.inputB) return;
        const numA = parseFloat(this.inputA) || 0;
        const numB = parseFloat(this.inputB) || 0;
        if(this.op in this.methods) {
            let result = this.methods[this.op](numA, numB);
            if(!Number.isFinite(result)){
                this.clear();
                this.display.textContent = "Error";
            }
            result = Math.round(result * 1000000000) / 1000000000;
            this.inputA = result.toString();
            this.inputB = ''; this.op = '';
            this.updateDisplay();
            return result;
        }else {
            this.inputA = ''; this.inputB =''; this.op = '';
            this.display.textContent = "No Fn";
        }
    };
    clear() {
        this.inputA = ''; this.inputB = ''; this.op = '';
        this.display.textContent = '0';
    };
    delete() {
        const empties = this.areInputsEmpty();
        if(!empties.inputB) {
            this.inputB = this.inputB.slice(0, -1);
            if(this.inputB == '-') this.inputB = '';
        }else if(!empties.op) {
            this.op = '';
        }else if(!empties.inputA) {
            this.inputA = this.inputA.slice(0, -1);
            if(this.inputA == '-') this.inputA = '';
        }
        this.updateDisplay();
    };
    getMethodString(key) {
        if(!(key in this.methods)) return '';
        let str = this.methods[key].toString();
        str = str.trim();
        str = str.replaceAll('function anonymous(a,b\n)', '');
        str = str.replaceAll(' {\n', '');
        str = str.replaceAll('return ', '');
        str = str.replaceAll(';\n}', '');
        return str;
    };
};

function showAlert(txt, icon = "⁉", duration = 5000){
    const alertModal = document.getElementById('alert');
    alertModal.querySelector('#alertText').textContent = txt;
    alertModal.querySelector('#alertIcon').textContent = icon;
    if(alertTimeout) {clearTimeout(alertTimeout)};
    alertModal.classList.add('show');
    alertTimeout = setTimeout(() => {hideAlert();}, duration);
}
function hideAlert(){
    document.getElementById('alert').classList.remove('show');
    alertTimeout = null;
}


const kowlkulater = new Calculator(display);
const keyInput = {
    '0': () => kowlkulater.inputNum('0'),
    '1': () => kowlkulater.inputNum('1'),
    '2': () => kowlkulater.inputNum('2'),
    '3': () => kowlkulater.inputNum('3'),
    '4': () => kowlkulater.inputNum('4'),
    '5': () => kowlkulater.inputNum('5'),
    '6': () => kowlkulater.inputNum('6'),
    '7': () => kowlkulater.inputNum('7'),
    '8': () => kowlkulater.inputNum('8'),
    '9': () => kowlkulater.inputNum('9'),
    'Enter': () => kowlkulater.calculate(),
    '+': () => kowlkulater.inputOp('+'),
    '-': () => kowlkulater.inputOp('-'),
    '*': () => kowlkulater.inputOp('*'),
    '/': () => kowlkulater.inputOp('/'),
    '.': () => kowlkulater.inputNum('.'),
    'Backspace': () => kowlkulater.delete(),
};


keys.addEventListener('click', e => {
    const target = e.target;
    const action = e.target.dataset.action;
    const content = e.target.textContent;

    if(!target.classList.contains('key')) return;
    switch(action){
        case 'clear': 
            kowlkulater.clear();
            break;
        case 'del':
            kowlkulater.delete();
            break;
        case 'equal':
            kowlkulater.calculate();
            break;
        case 'fncEdit':
            e.stopPropagation();
            fncDropdown.dispatchEvent(new Event('change'));
            fncEditModal.classList.add('show');
            break;
        case 'fnc1':
        case 'fnc2':
        case 'fnc3':
            kowlkulater.inputOp(action);
            break;
        default:
            if(target.classList.contains('op')){
                kowlkulater.inputOp(action);
            }else if(target.classList.contains('num')){
                kowlkulater.inputNum(action);
            }
    }
});
fncEditClose.addEventListener('click', () => fncEditModal.classList.remove('show'));
window.addEventListener('click', e => {
    if(e.target === fncEditModal) {
        fncEditModal.classList.remove('show');
    };
});
fncEditConfirm.addEventListener('click', e => {
    const selectedF = fncDropdown.value;
    const custExpress = fncExpression.value;

    try {
        const newMethod = new Function('a', 'b', `return ${custExpress};`);
        kowlkulater.registerMethod(selectedF, newMethod);
        fncEditModal.classList.remove('show');

        showAlert('Custom Function Saved!', '✔');
    } catch (err) {
        showAlert('Custom Function Not Valid!', '🛑');
    };
});
fncDropdown.addEventListener('change', e => {
    fncExpression.value = kowlkulater.getMethodString(e.target.value);
});
alertModal.addEventListener('click', (e) => {
    if(e.target.id == 'alertDismiss') alertModal.classList.remove('show');
});
window.addEventListener('keydown', e => {
    if(document.activeElement.tagName == 'INPUT' || 
        document.activeElement.tagName == 'TEXTAREA') return;
    const action = keyboardInput[e.key];
    if(action){
        e.preventDefault();
        action();
    }
});