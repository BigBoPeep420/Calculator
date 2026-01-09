
class Calculator{
    constructor(displayDiv, onFnCallback){
        this.iA = '';
        this.iB = '';
        this.iOp = '';
        this.res = '';
        this.onFn = onFnCallback;
        this.activeInput = 'iA';
        if(!displayDiv) this.display = document.querySelector('.display');
        else this.display = displayDiv;

        this.methods = {
            '+': (a,b) => a+b,
            '-': (a,b) => a-b,
            '*': (a,b) => a*b,
            '/': (a,b) => a/b,
        };
    };

    registerMethod(id, fn) {
        try{
            fn(1,1);
            this.methods[id] = fn;
            return true;
        } catch{
            return false;
        }
    };
    getMethodString(id){
        if(!(id in this.methods)) return '';
        let str = this.methods[id].toString();
        str = str.trim().replaceAll('function anonymous(a,b\n)', '');
        str = str.replaceAll(' {\n', '');
        str = str.replaceAll('return ', '');
        str = str.replaceAll(';\n}', '');
        return str;
    };
    clear() {
        this.iA = ''; this.iB = ''; this.iOp = ''; this.res = null;
        this.activeInput = 'iA'; this.updateDisplay();
    };
    delete() {
        if(this.res !== null) this.clear();
        if(this[this.activeInput] == ''){
            if(this.activeInput == 'iB') this.activeInput = 'iOp'
            else if(this.activeInput == 'iOp') this.activeInput = 'iA';
        }
        if(this.activeInput == 'iOp'){
            this.iOp = '';
            this.activeInput = 'iA';
        } else {
            this[this.activeInput] = this[this.activeInput].slice(0, -1);
        }
        this.updateDisplay();
    };
    input(action) {
        const isNum = !isNaN(action) || action == '.';
        const isOp = ['+', '-', '*', '/', 'fnc1', 'fnc2', 'fnc3'].includes(action);
        switch(action){
            case '=':
                this.calculate();
                return;
            case 'fncEdit':
                this.onFn(true);
                return;
            case 'del':
                this.delete();
                return;
            case 'clr':
                this.clear();
                return;
            default:
                if(this.res !== null && isOp){
                    this.iA = this.res.toString();
                    this.res = null;
                    this.iOp = action;
                    this.activeInput = 'iB';
                    this.updateDisplay();
                    return;
                }
                if(this.res !== null && isNum) this.clear();
                if(isOp){
                    if (this.iA == '') this.iA = '0';
                    this.iOp = action;
                    this.activeInput = 'iB';
                } else {
                    if(action == '.'){
                        if(this[this.activeInput] == '') this[this.activeInput] = '0';
                        if(this[this.activeInput].includes('.')) return;
                    }
                    if(this.activeInput == 'iOp') this.activeInput = 'iB';
                    this[this.activeInput] += action;
                }
                this.updateDisplay();
        }
        
        
        
    };
    calculate() {
        if(this.iA == '' || this.iB == '' || this.iOp == '') return;
        const a = parseFloat(this.iA);
        const b = parseFloat(this.iB);
        let result = 0;
        if(this.iOp in this.methods) {
            result = this.methods[this.iOp](a, b);
            if(typeof result == 'number') result = Math.round(result * 10000000) / 10000000;
            this.res = result;
            this.updateDisplay();
            this.iA = '';
            this.iB = '';
            this.iOp = '';
            this.activeInput = 'iA';
        } else { 
            this.clear();
            this.updateDisplay('No Func');
        }
    };
    updateDisplay(str){
        let txt = '';
        if(str){
            txt = str;
        }else if(this.res !== null){
            if(this.res == Infinity || isNaN(this.res)){
                txt = '8008135';
            } else txt = this.res;
        }else if(this.activeInput == 'iB' && this.iB !== ''){
            txt = this.iB;
        }else if(this.iOp !== '') {
            switch(this.iOp){
                case 'fnc1':
                    txt = 'F1';
                    break;
                case 'fnc2':
                    txt = 'F2';
                    break;
                case 'fnc3':
                    txt = 'F3';
                    break;
                default:
                    txt = this.iOp;
                    break;
            }
        }else txt = this.iA || '0';
        this.display.textContent = txt;
    };

}



export { Calculator };