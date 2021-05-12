'use strict';
import MRADuty from './mra_duty.js';
// all constants come up her
var driverCost = 200000;
var bluebook = 15000;
var registration = 15000;
var cof = 15000;
var insurancePercentage = 7; // current comprehensive insurance percentage

// listenser for the get price button
document.getElementById('changePrice').onclick = function () {
    getPrice();
};
//listener for the exchange rate input
document.getElementById('exchangeRate').addEventListener('input', getPrice);
function getPrice() {
    var exchangeRate = parseFloat(document.getElementById('exchangeRate').value);
    if (isNaN(exchangeRate)) {
        exchangeRate = 780.0;
    }
    var priceScript = "document.getElementById('fn-vehicle-price-total-price').innerHTML";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, { code: priceScript }, function (result) {
            var currentPrice = parseInt(result[0].replace(/\D/g, ''));
            document.getElementById('car-price').innerHTML = `MWK ${formatThousands(currentPrice * exchangeRate)}`;
            getCarYear(currentPrice * exchangeRate, tabs[0].id);
        });
    });
};
function getCarYear(currentPrice, tabID) {
    var yearScript = "document.getElementById('ga_params').getAttribute('spec_reg_year')";
    chrome.tabs.executeScript(tabID, { code: yearScript }, function (result) {
        var currentYear = result[0];
        getEngineSize(currentPrice, currentYear, tabID);
    });
}
function calculcateInsurance(price) {
    // add option to toggle comprehensive or 3rd party here in the future
    return price * (insurancePercentage / 100);
}
function getEngineSize(currentPrice, currentYear, tabID) {
    var engineSizeScript = "document.getElementById('ga_params').getAttribute('spec_engine_size')";
    chrome.tabs.executeScript(tabID, { code: engineSizeScript }, function (result) {
        var engineSize = parseInt(result[0]);
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
    });
}
function formatThousands(number) {
    var dp = 2;
    var s = '' + (Math.floor(number)), d = number % 1, i = s.length, r = '';
    while ((i -= 3) > 0) { r = ',' + s.substr(i, 3) + r; }
    return s.substr(0, i + 3) + r +
        (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
};