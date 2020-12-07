
// import moment from './moment';
const static_import_duty = 25;
const static_import_vat = 16.5;
let duty = {
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
}

function getVehicleValue(yearOfMake, engineSize, price) {
  let yearRange = "0-8";
  let engineSizeRange = "1000-1499";
//   const yearDiff = (moment().diff(moment(yearOfMake), 'year')) ;
  const yearDiff = 11;
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
// console.log(duty[engineSizeRange]);
  const import_duty = (duty.sedans[engineSizeRange][yearRange].import_duty /100) * price; 
//   console.log(duty.sedans[engineSizeRange][yearRange].import_duty);
console.log(import_duty);
  const import_excise  = ((duty.sedans[engineSizeRange][yearRange].import_excise /100) * price) + import_duty;
//   console.log(import_excise);
console.log(import_excise);
  const import_vat = ((duty.sedans[engineSizeRange][yearRange].import_vat/100) * import_excise) + import_excise; 
  console.log(import_vat);
  const total_duty_payable    = import_duty + import_excise + import_vat ;//K1, 786, 250.
  return(total_duty_payable); 
  // let carImportDuty =  
}
console.log(getVehicleValue(2011, 1499, 2000000));