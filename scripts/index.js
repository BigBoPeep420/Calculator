import { act } from "react";
import { Calculator } from "./calc";

function showFncEdit(bShow){
    if(bShow){
        document.getElementById('fncSelect').dispatchEvent(new Event('change'));
        document.getElementById('fncEdit').classList.add('show');
    } else fncEditModal.classList.remove('show');
};



const keyboardMap = {
    '0': () => kowlkulater.input('0'),
    '1': () => kowlkulater.input('1'),
    '2': () => kowlkulater.input('2'),
    '3': () => kowlkulater.input('3'),
    '4': () => kowlkulater.input('4'),
    '5': () => kowlkulater.input('5'),
    '6': () => kowlkulater.input('6'),
    '7': () => kowlkulater.input('7'),
    '8': () => kowlkulater.input('8'),
    '9': () => kowlkulater.input('9'),
    'Enter': () => kowlkulater.calculate(),
    '=': () => kowlkulater.calculate(),
    '+': () => kowlkulater.input('+'),
    '-': () => kowlkulater.input('-'),
    '*': () => kowlkulater.input('*'),
    '/': () => kowlkulater.input('/'),
    '.': () => kowlkulater.input('.'),
    'Backspace': () => kowlkulater.delete(),
    'Delete': () => kowlkulater.delete(),
    'SBackspace': () => kowlkulater.clear(),
}
const kowlkulater = new Calculator(document.getElementById('display'), showFncEdit);

document.getElementById('buttons').addEventListener('click', e => {
    if(!e.target.classList.contains('key')) return;
    kowlkulater.input(e.target.dataset.action);
    e.stopPropagation();
})
document.getElementById('fncClose').addEventListener('click', e => {
    showFncEdit(false);
})
