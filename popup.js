'use strict';
var changeColor = document.getElementById('changeColor');
var static_import_duty = 25;
var static_import_vat = 16.5;
var duty = {
    sedans: {
        "1000-1499": {
            '0-8': {
                import_duty: static_import_duty,
                import_excise: 0,
                import_vat: static_import_vat
            },
            '8-12': {
                import_duty: static_import_duty,
                import_excise: 30,
                import_vat: static_import_vat
            },
            '12+': {
                import_duty: static_import_duty,
                import_excise: 60,
                import_vat: static_import_vat
            }
        },
        "1500-1999": {
            '0-8': {
                import_duty: static_import_duty,
                import_excise: 15,
                import_vat: static_import_vat
            },
            '8-12': {
                import_duty: static_import_duty,
                import_excise: 45,
                import_vat: static_import_vat
            },
            '12+': {
                import_duty: static_import_duty,
                import_excise: 75,
                import_vat: static_import_vat
            }
        },
        "2000-2499": {
            '0-8': {
                import_duty: static_import_duty,
                import_excise: 35,
                import_vat: static_import_vat
            },
            '8-12': {
                import_duty: static_import_duty,
                import_excise: 60,
                import_vat: static_import_vat
            },
            '12+': {
                import_duty: static_import_duty,
                import_excise: 90,
                import_vat: static_import_vat
            }
        },
        "2500-2999": {
            '0-8': {
                import_duty: static_import_duty,
                import_excise: 45,
                import_vat: static_import_vat
            },
            '8-12': {
                import_duty: static_import_duty,
                import_excise: 70,
                import_vat: static_import_vat
            },
            '12+': {
                import_duty: static_import_duty,
                import_excise: 60,
                import_vat: static_import_vat
            }
        },
        "3000+": {
            '0-8': {
                import_duty: static_import_duty,
                import_excise: 0,
                import_vat: static_import_vat
            },
            '8-12': {
                import_duty: static_import_duty,
                import_excise: 30,
                import_vat: static_import_vat
            },
            '12+': {
                import_duty: static_import_duty,
                import_excise: 60,
                import_vat: static_import_vat
            }
        }
    }
};
function getPrice() {
    var priceScript = 'document.getElementsByClassName("ip-usd-price")[0].innerHTML';
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, { code: priceScript }, function (result) {
            var currentPrice = parseInt(result[0].replace(/\D/g, ''));
            document.getElementById('car-price').innerHTML = `MWK ${formatThousands(currentPrice * 750)}`;
            getCarYear(currentPrice * 750, tabs[0].id);
        });
    });
};

changeColor.onclick = function () {
    getPrice();
};
function getVehicleValue(yearOfMake, engineSize, price) {
    var yearRange = "0-8";
    var engineSizeRange = "1000-1499";
    var yearDiff = ((new Date).getFullYear() - yearOfMake);
    if (yearDiff >= 9 && yearDiff <= 12) {
        yearRange = "8-12";
    } else if (yearDiff >= 13) {
        yearRange = "12+";
    }
    if (engineSize >= 1500 && engineSize <= 1999) {
        engineSizeRange = "1500-1999";
    }
    else if (engineSize >= 2000 && engineSize <= 2499) {
        engineSizeRange = "2000-2499";
    }
    else if (engineSize >= 2500 && engineSize <= 2999) {
        engineSizeRange = "2500-2999";
    }
    else if (engineSize >= 3000) {
        engineSizeRange = "3000+";
    }
    var import_duty = (duty.sedans[engineSizeRange][yearRange].import_duty / 100) * price;
    var import_excise = ((duty.sedans[engineSizeRange][yearRange].import_excise / 100) * price) + import_duty;
    var import_vat = ((duty.sedans[engineSizeRange][yearRange].import_vat / 100) * import_excise) + import_excise;
    var total_duty_payable = import_duty + import_excise + import_vat;//K1, 786, 250.
    return (total_duty_payable);
}

function getCarYear(currentPrice, tabID) {
    var yearScript = "document.getElementById('ga_params').getAttribute('spec_reg_year')";
    chrome.tabs.executeScript(tabID, { code: yearScript }, function (result) {
        var currentYear = result[0];
        getEngineSize(currentPrice, currentYear, tabID);
    });
}
function getEngineSize(currentPrice, currentYear, tabID) {
    var engineSizeScript = "document.getElementById('ga_params').getAttribute('spec_engine_size')";
    chrome.tabs.executeScript(tabID, { code: engineSizeScript }, function (result) {
        var engineSize = parseInt(result[0]);
        var finalDuty = getVehicleValue(parseInt(currentYear), parseInt(engineSize), parseInt(currentPrice));
        document.getElementById('duty').innerHTML = `MWK ${formatThousands(finalDuty)}`;
        document.getElementById('driver').innerHTML = `MWK ${formatThousands(200000)}`;
        document.getElementById('total').innerHTML = `MWK ${formatThousands(currentPrice + finalDuty + 200000)}`;
    });
}


var formatThousands = function(n, dp){
    var s = ''+(Math.floor(n)), d = n % 1, i = s.length, r = '';
    while ( (i -= 3) > 0 ) { r = ',' + s.substr(i, 3) + r; }
    return s.substr(0, i + 3) + r + 
      (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
  };