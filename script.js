const baseURL = `https://v6.exchangerate-api.com/v6/c595a36150beb4ca4478d4ca/latest/`;

const inputAmount = document.getElementById('input-amount');
const exchangeAmount = document.getElementById('exchange-amount');

const primaryCurrencyList = document.getElementById('primary-list');
const secondaryCurrencyList = document.getElementById('secondary-list');
const btnSwap = document.querySelector('#swap-button');
const getExchangeRate = document.getElementById('get-exchange');

let exchangeRates = null;
let primaryCurrency = null;
let secondaryCurrency = null;
let currencyCodeList = null;

const init = () => {
    inputAmount.value = 1;
    primaryCurrency = 'USD';
    secondaryCurrency = 'INR';
    getCurrencyCodeList();
}

const setCurrencyCodeList = (element, currencyCodeArray, elementType) => {
    currencyCodeArray.map(code => {
        const optionEl = document.createElement('option');
        optionEl.value = code;
        optionEl.innerText = code;
        if(elementType === 'primary') {
            optionEl.selected = (code === primaryCurrency ? true : false);
        }
        else if(elementType === 'secondary') {
            optionEl.selected = (code === secondaryCurrency ? true : false);
        }

        element.appendChild(optionEl);
    });
}

const getCurrencyCodeList = async () => {
    const defaultCurrency = primaryCurrency;

    currencyCodeList = await fetch(`${baseURL}${defaultCurrency}`).then(res => {
        return res.json();
    }).then(data => {
        exchangeRates = data.conversion_rates;
        return Object.keys(data.conversion_rates).sort();
    });

    exchangeAmount.innerText = `${inputAmount.value} ${primaryCurrency} = ${(exchangeRates[secondaryCurrency]*inputAmount.value).toFixed(4)} ${secondaryCurrency}`;
    setCurrencyCodeList(primaryCurrencyList, currencyCodeList, elementType = 'primary');
    setCurrencyCodeList(secondaryCurrencyList, currencyCodeList, elementType = 'secondary');
}

const setExchangeRates = async () => {
    primaryCurrency = primaryCurrencyList.value;
    secondaryCurrency = secondaryCurrencyList.value;

    exchangeRates = await fetch(`${baseURL}${primaryCurrency}`).then(res => {
        return res.json();
    }).then(data => {
        return data.conversion_rates;
    });
}

primaryCurrencyList.addEventListener('change', setExchangeRates);
secondaryCurrencyList.addEventListener('change', setExchangeRates);

getExchangeRate.addEventListener('click', () => {
    exchangeAmount.innerText = `${inputAmount.value} ${primaryCurrency} = ${(exchangeRates[secondaryCurrency]*inputAmount.value).toFixed(4)} ${secondaryCurrency}`;
});

btnSwap.addEventListener('click', () => {
    primaryCurrencyList.value = secondaryCurrency;
    secondaryCurrencyList.value = primaryCurrency;
    primaryCurrency = primaryCurrencyList.value;
    secondaryCurrency = secondaryCurrencyList.value;

    setExchangeRates();
    exchangeAmount.innerText = `${inputAmount.value} ${primaryCurrency} = ? ${secondaryCurrency}`;
});

init();