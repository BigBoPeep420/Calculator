const MAX_CHARS = 14;
const keys = document.querySelector('.buttons');
const display = document.querySelector('.display');

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
    displayOutput(str) {
        if(str.length > MAX_CHARS) {
            this.display.textContent = '..' + str.slice(-(MAX_CHARS - 2));
        } else this.display.textContent = str;
    };
    inputNum(str) {
        const empties = this.areInputsEmpty();
        if(empties.op) {
            if(this.display.textContent.length < MAX_CHARS) {
                this.inputA += str;
                this.displayOutput(this.inputA);
            }
        } else {
            if(this.display.textContent.length < MAX_CHARS) {
                this.inputB += str;
                this.displayOutput(this.inputB);
            }
        }
    };
    inputOp(str) {
        const empties = this.areInputsEmpty();
        if(!empties.inputA && !empties.op && !empties.inputB) {
            this.calculate();
            this.op = str;
        } else {
            this.op = str;
            this.displayOutput(this.op);
        }
        
    };
    calculate() {
        if(parseFloat(this.inputA) == NaN) return; //Add error for CANNOT PARSE INPUT A
        if(parseFloat(this.inputB) == NaN) return; //Add error for CANNOT PARSE INPUT B
        if(!(this.op in this.methods)) return; //Add error for NO SUCH METHOD IMPLEMENTED
        const numA = parseFloat(this.inputA); const numB = parseFloat(this.inputB);
        this.inputA = this.methods[this.op](numA, numB); this.inputB = ''; this.op = '';
        this.displayOutput(this.inputA);
    };
    clear() {
        this.inputA = ''; this.inputB = ''; this.op = '';
        this.display.textContent = '';
    };
    delete() {
        const empties = this.areInputsEmpty();
        if(empties.inputA) {
            // Empty, do nothing
        } else if((!empties.inputA) && (empties.inputB && empties.op)){
            this.inputA = this.display.textContent.slice(0, -1);
            this.displayOutput(this.inputA);
        } else if(!empties.inputA && empties.inputB && empties.op){
            this.inputB = this.display.textContent.slice(0, -1);
            this.displayOutput(this.inputB);
        } else {
            this.op = '';
            this.displayOutput(this.inputA);
        };
    };
};

const kowlkulater = new Calculator(display);

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
    }

});