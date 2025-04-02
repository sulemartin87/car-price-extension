'use strict';
import MRADuty from './mra_duty.js';
// all constants come up her
var driverCost = 200000;
var bluebook = 15000;
var registration = 15000;
var cof = 15000;
var insurancePercentage = 7; // current comprehensive insurance percentage

// listener for the get price button
document.getElementById('changePrice').onclick = function () {
    getPrice();
};
//listener for the exchange rate input
document.getElementById('exchangeRate').addEventListener('input', getPrice);

// Show error message in the popup
function showError(message) {
    // Hide the table content and show error
    document.querySelector('table').style.display = 'none';
    
    // Create error div if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '20px';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.fontWeight = 'bold';
        document.body.insertBefore(errorDiv, document.querySelector('button'));
    }
    
    // Set error message
    document.getElementById('error-message').innerHTML = message;
    
    // Keep the button visible to try again
    document.getElementById('changePrice').innerHTML = 'Try Again';
}

// Clear error and show table
function clearError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    document.querySelector('table').style.display = '';
    document.getElementById('changePrice').innerHTML = 'get price';
}

function getPrice() {
    clearError();
    
    var exchangeRate = parseFloat(document.getElementById('exchangeRate').value);
    if (isNaN(exchangeRate)) {
        exchangeRate = 1750.0;
    }
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // First check if we're on the correct website
        if (!tabs[0].url.includes('beforward.jp')) {
            showError('Please navigate to a BeForward vehicle page to use this extension.');
            return;
        }
        
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: checkCarSelected
        }).then(result => {
            const status = result[0].result;
            
            if (status.error) {
                showError(status.message);
                return;
            }
            
            // If all good, get the price
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: getPriceFromPage
            }).then(result => {
                if (!result[0].result || result[0].result === 'null' || result[0].result === '') {
                    showError('Could not find the vehicle price. Please make sure you are on a vehicle details page.');
                    return;
                }
                
                var currentPrice = parseInt(result[0].result.replace(/\D/g, ''));
                if (isNaN(currentPrice) || currentPrice === 0) {
                    showError('Invalid price detected. Please ensure you are on a vehicle details page.');
                    return;
                }
                
                document.getElementById('car-price').innerHTML = `MWK ${formatThousands(currentPrice * exchangeRate)}`;
                getCarYear(currentPrice * exchangeRate, tabs[0].id);
            }).catch(error => {
                console.error("Error getting price:", error);
                showError('Error retrieving vehicle price. Please refresh the page and try again.');
            });
        }).catch(error => {
            console.error("Error checking page:", error);
            showError('Error accessing page content. Please ensure you are on a BeForward vehicle page.');
        });
    });
}

// Functions to be injected into the page
function checkCarSelected() {
    // Check if we're on a car details page by looking for required elements
    const priceElement = document.getElementById('fn-vehicle-price-total-price');
    const paramsElement = document.getElementById('ga_params');
    
    if (!priceElement) {
        return { 
            error: true, 
            message: 'No car selected. Please navigate to a specific vehicle details page.'
        };
    }
    
    if (!paramsElement) {
        return { 
            error: true, 
            message: 'Vehicle information not found. Please ensure you are viewing a complete vehicle listing.'
        };
    }
    
    const regYear = paramsElement.getAttribute('spec_reg_year');
    const engineSize = paramsElement.getAttribute('spec_engine_size');
    
    if (!regYear || !engineSize) {
        return { 
            error: true, 
            message: 'Vehicle year or engine size information missing. This vehicle may not be compatible with the calculator.'
        };
    }
    
    return { error: false };
}

function getPriceFromPage() {
    const priceElement = document.getElementById('fn-vehicle-price-total-price');
    return priceElement ? priceElement.innerHTML : null;
}

function getYearFromPage() {
    const paramsElement = document.getElementById('ga_params');
    return paramsElement ? paramsElement.getAttribute('spec_reg_year') : null;
}

function getEngineSizeFromPage() {
    const paramsElement = document.getElementById('ga_params');
    return paramsElement ? paramsElement.getAttribute('spec_engine_size') : null;
}

function getCarYear(currentPrice, tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: getYearFromPage
    }).then(result => {
        var currentYear = result[0].result;
        if (!currentYear) {
            showError('Could not retrieve vehicle year information.');
            return;
        }
        getEngineSize(currentPrice, currentYear, tabId);
    }).catch(error => {
        console.error("Error getting year:", error);
        showError('Error retrieving vehicle year. Please try again.');
    });
}

function calculcateInsurance(price) {
    // add option to toggle comprehensive or 3rd party here in the future
    return price * (insurancePercentage / 100);
}

function getEngineSize(currentPrice, currentYear, tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: getEngineSizeFromPage
    }).then(result => {
        var engineSize = parseInt(result[0].result);
        if (isNaN(engineSize) || engineSize === 0) {
            showError('Invalid or missing engine size information.');
            return;
        }
        
        var finalDuty = MRADuty.calculateDuty(parseInt(currentYear), engineSize, parseInt(currentPrice));
        var priceWithoutInsurance = currentPrice + finalDuty + driverCost;
        var insurance = calculcateInsurance(priceWithoutInsurance);

        document.getElementById('duty').innerHTML = `MWK ${formatThousands(finalDuty)}`;
        document.getElementById('insurance').innerHTML = `MWK ${formatThousands(insurance)}`;
        document.getElementById('driver').innerHTML = `MWK ${formatThousands(driverCost)}`;
        document.getElementById('blue-book').innerHTML = `MWK ${formatThousands(bluebook)}`;
        document.getElementById('cof').innerHTML = `MWK ${formatThousands(cof)}`;
        document.getElementById('registration').innerHTML = `MWK ${formatThousands(registration)}`;
        document.getElementById('total').innerHTML = `MWK ${formatThousands(priceWithoutInsurance + insurance + bluebook + registration + cof)}`;
    }).catch(error => {
        console.error("Error getting engine size:", error);
        showError('Error retrieving engine size information. Please try again.');
    });
}

function formatThousands(number) {
    var dp = 2;
    var s = '' + (Math.floor(number)), d = number % 1, i = s.length, r = '';
    while ((i -= 3) > 0) { r = ',' + s.substr(i, 3) + r; }
    return s.substr(0, i + 3) + r +
        (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
}