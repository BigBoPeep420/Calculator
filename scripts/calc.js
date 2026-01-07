const keys = document.querySelector('.buttons');
const display = document.querySelector('.display');
const fncEditModal = document.querySelector('.fncEdit');

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
        if((sym.length === 1) || (sym.length === 2)){
            this.methods[sym] = fn;
        };
        // Add Error for OPERATOR TOO SHORT OR LONG
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
};

const kowlkulater = new Calculator(display);

window.addEventListener('click', e => {
    const inside = e.target.closest('fncEdit');
    if(fncEditModal.classList.contains('show') && inside){
        fncEditModal.classList.remove('show');
    }
});
keys.addEventListener('click', e => {
    if (!e.target.classList.contains('key')) return; // Didn't click a button
    if (e.target.classList.contains('op')){
        kowlkulater.inputOp(e.target.dataset.action);
    };
    if (e.target.classList.contains('num')){
        kowlkulater.inputNum(e.target.textContent);
    };
    if (e.target.dataset.action == 'clear'){
        kowlkulater.clear();
    };
    if (e.target.dataset.action == 'del'){
        kowlkulater.delete();
    };
    if (e.target.dataset.action == 'equal'){
        kowlkulater.calculate();
    };
    if (e.target.dataset.action == 'fncEdit'){
        fncEditModal.classList.add('show');
    };
});