// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
import './moment'
import moment from './moment';
let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
const static_import_duty = 25;
const static_import_vat = 16.5;
let duty = {
  sedans: {
    "1000-1499": {
      '0-8': {
        import_duty: static_import_duty,
        import_exice: 0,
        import_vat: static_import_vat
      },
      '8-12': {
        import_duty: static_import_duty,
        import_exice: 30,
        import_vat: static_import_vat
      },
      '12+': {
        import_duty: static_import_duty,
        import_exice: 60,
        import_vat: static_import_vat
      }
    },
    "1500-1999": {
      '0-8': {
        import_duty: static_import_duty,
        import_exice: 15,
        import_vat: static_import_vat
      },
      '8-12': {
        import_duty: static_import_duty,
        import_exice: 45,
        import_vat: static_import_vat
      },
      '12+': {
        import_duty: static_import_duty,
        import_exice: 75,
        import_vat: static_import_vat
      }
    },
    "2000-2499": {
      '0-8': {
        import_duty: static_import_duty,
        import_exice: 35,
        import_vat: static_import_vat
      },
      '8-12': {
        import_duty: static_import_duty,
        import_exice: 60,
        import_vat: static_import_vat
      },
      '12+': {
        import_duty: static_import_duty,
        import_exice: 90,
        import_vat: static_import_vat
      }
    },
    "2500-2999": {
      '0-8': {
        import_duty: static_import_duty,
        import_exice: 45,
        import_vat: static_import_vat
      },
      '8-12': {
        import_duty: static_import_duty,
        import_exice: 70,
        import_vat: static_import_vat
      },
      '12+': {
        import_duty: static_import_duty,
        import_exice: 60,
        import_vat: static_import_vat
      }
    },
    "3000+": {
      '0-8': {
        import_duty: static_import_duty,
        import_exice: 0,
        import_vat: static_import_vat
      },
      '8-12': {
        import_duty: static_import_duty,
        import_exice: 30,
        import_vat: static_import_vat
      },
      '12+': {
        import_duty: static_import_duty,
        import_exice: 60,
        import_vat: static_import_vat
      }
    }
  }
}

function getVehicleValue(yearOfMake, engineSize, price) {
  let yearRange = "0-8";
  let engineSizeRange = "1000-1499";
  const yearDiff = (moment().diff(moment(yearOfMake), 'year')) ;
  if (yearDiff >= 9 && yearDiff <= 12) {
    yearRange = "8-12";
  } else if (yearDiff >= 13){
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
  
  const import_duty = duty[yearRange][engineSizeRange].import_duty /100 * price; 
  const import_excise  = duty[yearRange][engineSizeRange].import_excise /100 * price + import_duty;
  const import_vat = duty[yearRange][engineSizeRange].import_vat/100 * price + import_excise; 
  const total_duty_payable    = import_duty + import_excise + import_vat ;//K1, 786, 250.
  return(total_duty_payable); 
  // let carImportDuty =  
}
let price = 'document.getElementById("with-currency-price").innerHTML';
changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code:'document.getElementById("selected_total_price").innerHTML'}, function(result) {
          // console.log(result);
          let currentPrice = result[0].replace(/\D/g, '');
          // replace(/\D/g, '');
          document.getElementById('car-price-1').innerHTML = `MWK ${currentPrice * 750}`;
        });
  });
};
