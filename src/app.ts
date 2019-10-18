import { calculateTipAmount, calculateTotalAmount } from './utils';
import { parse } from 'querystring';

let activeButton: HTMLDivElement;
let amountInput: HTMLInputElement;
let billAmount: HTMLSpanElement;
let tipButtons: NodeListOf<HTMLDivElement>;
let tipAmountSpans: NodeListOf<HTMLSpanElement>;
let tipAmount: string;
let tipValue: HTMLSpanElement;
let totalAmount: HTMLSpanElement;
let errorMessage: HTMLHeadingElement;
let preferredTipAmountEl: HTMLSpanElement;
let preferredTipAmountChildren: NodeListOf<HTMLDivElement>;

let preferredTipAmount: string;
export let customTipAmount: string;

export function runApp() {
    tipButtons = document.querySelectorAll('.tip-button') as NodeListOf<HTMLDivElement>;
    tipAmountSpans = document.querySelectorAll('.tip') as NodeListOf<HTMLSpanElement>;
    tipValue = document.querySelector('#tip-value-dollars') as HTMLSpanElement;
    totalAmount = document.querySelector('#total-bill-amount') as HTMLSpanElement;
    amountInput = document.querySelector('#bill-amount-input') as HTMLInputElement;
    billAmount = document.querySelector('#bill-amount') as HTMLSpanElement;
    errorMessage = document.querySelector('.error') as HTMLHeadingElement;
    preferredTipAmountEl = document.querySelector('#preferred-amount') as HTMLSpanElement;
    preferredTipAmountChildren = document.querySelectorAll('.preferred-item') as NodeListOf<HTMLDivElement>;

    loadLocalData();

    tipAmount = preferredTipAmount;
    preferredTipAmountEl.innerText = preferredTipAmount;

    tipButtons.forEach((button, index) => {
        if (index !== 3) {
            button.dataset.tipPercent = (10 + (index * 5)).toString();
        } else {
            button.dataset.tipPercent = 'Custom';
        }
        if (button.dataset.tipPercent === preferredTipAmount) {
            activeButton = button;
            activeButton.classList.add('disabled');
        }
        setTipAmount(tipAmount);
        button.addEventListener('click', handleTipAmountClick);
    });

    preferredTipAmountChildren.forEach(item => {
        item.addEventListener('click', handlePreferredAmountClick);
    });
    amountInput.addEventListener('keyup', handleKeyUp);
}

function handleTipAmountClick() {
    const clickedButton = this as HTMLDivElement;
    if (clickedButton !== activeButton) {
        activeButton.classList.toggle('disabled');
        activeButton = clickedButton;
        clickedButton.classList.toggle('disabled');
        setTipAmount(clickedButton.dataset.tipPercent);
        setBillInformation();
    }
}

function handlePreferredAmountClick() {
    const clickedItem = this as HTMLDivElement;
    preferredTipAmountEl.innerText = clickedItem.dataset.preferred;
    preferredTipAmount = clickedItem.dataset.preferred;
    localStorage.setItem('preferredTipAmount', preferredTipAmount);
    tipButtons.forEach(button => {
        if (button.dataset.tipPercent === clickedItem.dataset.preferred) {
            activeButton.classList.toggle('disabled');
            activeButton = button;
            button.classList.toggle('disabled');
            setTipAmount(button.dataset.tipPercent);
            setBillInformation();
        }
    });
}

function handleKeyUp() {
    if (parseFloat(amountInput.value) < 0 || isNaN(parseFloat(amountInput.value))) {
        amountInput.classList.add('is-invalid');
        errorMessage.classList.remove('hidden');
        setDefaults();
    } else {
        amountInput.classList.remove('is-invalid');
        errorMessage.classList.add('hidden');
        billAmount.innerText = parseFloat(amountInput.value).toFixed(2);
        setBillInformation();
    }
}

function setTipAmount(amount: string) {
    tipAmountSpans.forEach(span => {
        if (amount === 'Custom') {
            span.innerHTML = customTipAmount;
        } else {
            span.innerHTML = amount;
        }
    });
}

function setBillInformation() {
    tipValue.innerText = calculateTipAmount(billAmount.innerText, activeButton.dataset.tipPercent);
    totalAmount.innerText = calculateTotalAmount(billAmount.innerText, tipValue.innerText);
}

function setDefaults() {
    billAmount.innerText = '0';
    tipValue.innerText = '0';
    totalAmount.innerText = '0';
}

function loadLocalData() {
    if (localStorage.getItem('preferredTipAmount')) {
        preferredTipAmount = localStorage.getItem('preferredTipAmount');
    } else {
        localStorage.setItem('preferredTipAmount', '20');
        preferredTipAmount = localStorage.getItem(preferredTipAmount);
    }

    if (localStorage.getItem('customAmount')) {
        customTipAmount = localStorage.getItem('customAmount');
    } else {
        localStorage.setItem('customAmount', '0');
        customTipAmount = localStorage.getItem('customAmount');
    }
}
