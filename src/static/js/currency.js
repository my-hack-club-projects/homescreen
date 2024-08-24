const response = await fetch('/currency/all');
const currencies = await response.json();

const dropdowns = document.querySelectorAll('.currency-dropdown');
const input_from = document.getElementById('currency-from');
const input_to = document.getElementById('currency-to');
const dropdown_from = document.getElementById('from-dropdown');
const dropdown_to = document.getElementById('to-dropdown');

const inputs = {
    "currency-from": dropdown_from,
    "currency-to": dropdown_to
};

async function onChanged(elementThatChanged) {
    const value = elementThatChanged.value; // The number amount of the currency
    const currency = inputs[elementThatChanged.id].value; // The currency name
    const otherInput = elementThatChanged === input_from ? input_to : input_from; // The other input element
    const otherCurrency = inputs[otherInput.id].value; // The other currency name

    if (isNaN(value) || value === '') {
        otherInput.value = '';
        return;
    }

    const response = await fetch(`/currency/convert?value=${value}&from=${currency}&to=${otherCurrency}`);
    const result = await response.json();

    if (result.success) {
        otherInput.value = result.data;
    }
}

dropdowns.forEach(dropdown => {
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.name;
        option.text = currency.name;
        dropdown.add(option);
    });
});

input_from.addEventListener('input', () => onChanged(input_from));
input_to.addEventListener('input', () => onChanged(input_to));
dropdown_from.addEventListener('change', () => onChanged(input_from));
dropdown_to.addEventListener('change', () => onChanged(input_to));