const keys = document.querySelector('.buttons');
const display = document.querySelector('.display');
const fncEditModal = document.querySelector('#fncEdit');
const fncEditClose = document.querySelector('#fncClose');
const fncEditConfirm = document.querySelector('#fncConfirm');
const fncDropdown = document.querySelector('#fncSelect');
const fncExpression = document.querySelector('#fncExpression');

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
    getMethodString(key) {
        if(!(key in this.methods)) return '';
        let str = this.methods[key].toString();
        return str;
    };
};

const kowlkulater = new Calculator(display);



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
        case 'F1':
            
            break;
        case 'F2':

            break;
        case 'F3':

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
        const newMethod = new Function('a', 'b', `return (${custExpress})(a, b)`);
        kowlkulater.registerMethod(selectedF, newMethod);
        fncEditModal.classList.remove('show');
        //-------------------------
        //  Add success alert here
        //-------------------------
    } catch (err) {
        //-------------------------
        //  Add failure alert here
        //-------------------------
    };
});
fncDropdown.addEventListener('change', e => {
    fncExpression.value = kowlkulater.getMethodString(e.target.value);
})