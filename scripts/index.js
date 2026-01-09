import { Calculator } from "./calc.js";

function showFncEdit(bShow){
    if(bShow){
        document.getElementById('fncSelect').dispatchEvent(new Event('change'));
        fncEditModal.classList.add('show');
    } else fncEditModal.classList.remove('show');
};
function showAlert(txt, icon = '⁉', duration = 5000){
    const alertModal = document.getElementById('alert');
    alertModal.querySelector('#alertText').textContent = txt;
    alertModal.querySelector('#alertIcon').textContent = icon;
    if(alertTimeout) clearTimeout(alertTimeout);
    alertModal.classList.add('show');
    alertTimeout = setTimeout(() => {hideAlert();}, duration);
}
function hideAlert(){
    document.getElementById('alert').classList.remove('show');
    alertTimeout = null;
}
function pressButton(buttonStr){
    let btn;
    switch(buttonStr){
        
    }
}



const keyboardMap = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
    '6': '6', '7': '7', '8': '8', '9': '9', 'Enter': '=', '=': '=',
    '+': '+', '-': '-', '*': '*', '/': '/', '.': '.', 'Backspace': 'del',
    'Delete': 'del', 'SBackspace': 'clr',
}
const kowlkulater = new Calculator(document.getElementById('display'), showFncEdit);
const fncEditModal = document.getElementById('fncEdit');
let alertTimeout = null;

window.addEventListener('click', e => {
    if(fncEditModal.contains(e.target)) {}
    else fncEditModal.classList.remove('show');
})
document.getElementById('buttons').addEventListener('click', e => {
    if(fncEditModal.classList.contains('show')) fncEditModal.classList.remove('show');
    if(!e.target.classList.contains('key')) return;
    kowlkulater.input(e.target.dataset.action);
    e.stopPropagation();
})
document.getElementById('fncClose').addEventListener('click', e => {
    showFncEdit(false);
})
document.getElementById('fncConfirm').addEventListener('click', e => {
    const fncSlot = document.getElementById('fncSelect').value;
    const expr = document.getElementById('fncExpression').value;
    const newMethod = new Function('a', 'b', `return ${expr};`);
    const success = kowlkulater.registerMethod(fncSlot, newMethod);
    let slot = 'F1';
    switch(fncSlot){
        case 'fnc1':
            slot = 'F1';
            break;
        case 'fnc2':
            slot = 'F2';
            break;
        case 'fnc3':
            slot = 'F3';
            break;
    }
    if(success){
        showAlert(`Custom Function Saved to ${slot}!`, '✔');
        fncEditModal.classList.remove('show');
    } else {
        showAlert('Custom Function Not Valid!', '🛑');
    }
})
document.getElementById('fncSelect').addEventListener('change', e => {
    document.getElementById('fncExpression').value = kowlkulater.getMethodString(e.target.value);
})
document.getElementById('alertDismiss').addEventListener('click', e => {
    hideAlert();
})
window.addEventListener('keydown', e => {
    if(document.activeElement.tagName == 'INPUT' ||
        document.activeElement.tagName == 'TEXTAREA') return;
    let key = e.key;
    if(key == 'Backspace' && e.shiftKey) key = 'SBackspace';
    const action = keyboardMap[key] || e.key;
    const btn = document.querySelector(`.key[data-action="${action}"]`);
    if (btn){
        e.preventDefault();
        btn.classList.add('active');
        kowlkulater.input(action);
    }
})
window.addEventListener('keyup', e => {
    let key = e.key;
    if(key == 'Backspace' && e.shiftKey) key = 'SBackspace';
    const action = keyboardMap[key] || e.key;
    const btn = document.querySelector(`.key[data-action="${action}"]`);
    if(btn) btn.classList.remove('active');
})
document.getElementById('testExpression').addEventListener('click', e => {
    const exp = document.getElementById('fncExpression').value;
    try{
        const fnc = new Function('a', 'b', `return ${exp};`);
        fnc(2, 5);
        document.getElementById('testExpression').classList.add('pass');
        document.getElementById('testExpression').classList.remove('fail');
    }catch{
        document.getElementById('testExpression').classList.remove('pass');
        document.getElementById('testExpression').classList.add('fail');
    }
})