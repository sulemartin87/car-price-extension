var MRADuty = (() => {
    var static_import_duty = 25;
    var static_import_vat = 16.5;
    var dutyObject = {
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
    /**
        * Calculate the duty of car
        * 
        * @param {int} yearOfMake year of make of the vehicle. 
        * @param {int} engineSize engine size of the vehicle. 
        * @param {int} price price of make of the vehicle which includes shipping and port charge. 
        *
        *  
   */
    var calculateDuty = (yearOfMake, engineSize, price, vehicleType = 'sedans') => {
        // function getVehicleValue(yearOfMake, engineSize, price) {
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
        var import_duty = (dutyObject[vehicleType][engineSizeRange][yearRange].import_duty / 100) * price;
        var import_excise = ((dutyObject[vehicleType][engineSizeRange][yearRange].import_excise / 100) * price + import_duty);
        var import_vat = ((dutyObject[vehicleType][engineSizeRange][yearRange].import_vat / 100) * (import_excise + import_excise));
        var total_duty_payable = import_duty + import_excise + import_vat;
        return (total_duty_payable);
    }
    return { calculateDuty };
})();
export default MRADuty;