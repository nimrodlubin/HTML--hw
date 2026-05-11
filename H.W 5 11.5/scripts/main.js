import { hibor, hilok, cafal, hisor } from "./functions.js";
let n1 = Number(prompt('הכנס מספר 1'));
let n2 = Number(prompt('הכנס מספר 2'));

let opertor = prompt("אנא הכנס את הפעולה הרצויה '+' / '-' / '*' / '/'");

switch (opertor) {
    case '+':
        console.log(hibor(n1, n2));
        break;
    case '-':
        console.log(hisor(n1, n2));
        break;
    case '*':
        console.log(cafal(n1, n2));
        break;
    case '/':
        console.log(hilok(n1, n2));
        break;
    default:
        console.log('לא הכנסת פעולה נכונה');
        break;
}
