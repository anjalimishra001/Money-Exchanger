const inrInput = document.getElementById('inr');
const usdInput = document.getElementById('usd');
const convertBtn = document.getElementById('convertBtn');
const switchBtn = document.getElementById('switchBtn');
const errorMsg = document.getElementById('errorMsg');

let isInrToUsd = true;
let exchangeRate = 0.012; // Default rate, will be updated from API

// Function to fetch the latest exchange rate
async function fetchExchangeRate() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await response.json();
        exchangeRate = data.rates.USD;
        console.log('Updated exchange rate:', exchangeRate);
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        errorMsg.textContent = 'Failed to fetch latest exchange rate. Using default rate.';
    }
}

async function convertCurrency() {
    errorMsg.textContent = '';
    
    // Fetch the latest exchange rate before converting
    await fetchExchangeRate();
    
    if (isInrToUsd) {
        const inrValue = parseFloat(inrInput.value);
        if (isNaN(inrValue)) {
            errorMsg.textContent = 'Please enter a valid number for INR';
            return;
        }
        const usdValue = (inrValue * exchangeRate).toFixed(2);
        usdInput.value = usdValue;
    } else {
        const usdValue = parseFloat(usdInput.value);
        if (isNaN(usdValue)) {
            errorMsg.textContent = 'Please enter a valid number for USD';
            return;
        }
        const inrValue = (usdValue / exchangeRate).toFixed(2);
        inrInput.value = inrValue;
    }
}

function switchConversion() {
    isInrToUsd = !isInrToUsd;
    inrInput.value = '';
    usdInput.value = '';
    errorMsg.textContent = '';
    
    if (isInrToUsd) {
        inrInput.removeAttribute('readonly');
        usdInput.setAttribute('readonly', 'true');
    } else {
        usdInput.removeAttribute('readonly');
        inrInput.setAttribute('readonly', 'true');
    }
}

convertBtn.addEventListener('click', convertCurrency);
switchBtn.addEventListener('click', switchConversion);

inrInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        convertCurrency();
    }
});

usdInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        convertCurrency();
    }
});

// Initialize the app
switchConversion();
// Fetch the initial exchange rate
fetchExchangeRate();