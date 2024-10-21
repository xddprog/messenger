export function choosePlural(amount, variants) {
    let variant = 2;
    if (amount % 10 === 1 && amount % 100 !== 11) {
        variant = 0;
    } else if (amount % 10 >= 2 && amount % 10 <= 4 && (amount % 100 < 10 || amount % 100 >= 20)) {
        variant = 1; 
    }
    return `${amount} ${variants[variant]}`;
}
