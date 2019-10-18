import { customTipAmount } from './app';

export function ready(cb: () => void) {
    document.onreadystatechange = function () {
        if (document.readyState === 'interactive') {
            cb();
        }
    };
}

export function calculateTipAmount(billAmount: string, tipAmount: string): string {
    if (tipAmount === 'Custom') {
        tipAmount = customTipAmount;
    }
    const tip = parseFloat(tipAmount) / 100;
    const bill = parseFloat(billAmount);
    const tipTotal = bill * tip;
    return tipTotal.toFixed(2);
}

export function calculateTotalAmount(billAmount: string, tipAmount: string): string {
    const tip = parseFloat(tipAmount);
    const bill = parseFloat(billAmount);
    const total = tip + bill;
    return total.toFixed(2);
}
