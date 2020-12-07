// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
const static_import_duty = 25;
const static_import_vat = 16.5;
let duty = {
  sedans: {
    "1000-1490": {
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
        import_exice: 30,
        import_vat: static_import_vat
      },
      '12+': {
        import_duty: static_import_duty,
        import_exice: 60,
        import_vat: static_import_vat
      }
    },
    "2000-2499": {
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
    "2500-2999": {
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
