import { airportsList, aircraftsList, quantityFlightsList } from '../../db/DataBase.js';
import { validateAll } from './validate.js';

// === Variable ===

const form = document.forms[0];
const popup = document.querySelector('.popup');
const ENTER_KEY = 'Enter';
const TYPE_TELEGRAM = 'SCR';
const AC_ICAO_CODE = 'A4';
const PHRASE_TERMINAL_ARRIVAL = 'TA';
const PHRASE_TERMINAL_DEPARTURE = 'TD';
const PHRASE_AIRCRAFT_REGISTRATION = 'RE';


// ========================================================================
const data = {
    modeCorrection: undefined,
    aircraft: {
        aircraftNumber: undefined,
        aircraftType: undefined,
        aircraftLayout: undefined,
    },
    airport: {
        airportNameMain: undefined,
        airportNameSecondary: undefined,
        isArrivaled: undefined,
        airportTerminal: undefined,
    },
    flight: {
        flightNumberMain: undefined,
        flightNumberSecond: undefined,
        flightType: undefined,
        quantityFlights: undefined,
    },
    time: {
        currentDate: undefined,
        currentSeason: undefined,
        originTimeMain: undefined,
        correctionTimeMain: undefined,
        originTimeSecondary: undefined,
        correctionTimeSecondary: undefined,
    },
    setting: {
        emailResponse: 'ops1@azimuth.aero'.toUpperCase(),
        textAdded: 'GI BRGDS,=AZIMUTH=OPS',
    },
}

// === LOGIC ===

renderAircraftsList(form, aircraftsList);
renderAirportsList(form, airportsList);

// ========================================================================

// ==== HANDLERS ====
for (const item of form.elements.airports) {
    const radioChangeHandler = item.addEventListener('change', () => {
        data.airport.airportNameMain = setAirportNameMain(form);
        let promise = new Promise((resolve, reject) => {
            resolve(renderAirportsDirectionList(form, airportsList, data.airport.airportNameMain));
        }).then(() => {
            // TODO: CRUTCH
            try {
                for (const item of form.elements.airportsDirect) {
                    const radioChangeHandler = item.addEventListener('change', () => {
                        data.airport.airportNameSecondary = setAirportNameSecondary(form);
                    })
                }
            } catch (error) {
                form.elements.airportsDirect.addEventListener('change', () => {
                    data.airport.airportNameSecondary = setAirportNameSecondary(form);
                });
            }

        }).then(() => { data.airport.airportNameMain = setAirportNameMain(form) });
    })
}

document.addEventListener('change', e => {
    if (e.target.id === 'correction') {
        renderQuantityFlights(form, quantityFlightsList);
        const onInputChangeHandler = document.addEventListener('change', function inputQuantityFlightsHandler(e) {
            if (e.target.name === 'quantity') {
                data.flight.quantityFlights = e.target.value;
                if (e.target.value > 1) {
                    showCorrectionSecondaryBlock('.time-secondary');
                    dispayBlockTimeSecondary('.flight-number-secondary');
                } else {
                    hideCorrectionSecondaryBlock('.time-secondary');
                    noneDispayBlockTimeSecondary('.flight-number-secondary');
                }
            }
        })
    } else if (e.target.id && e.target.id === 'new') {
        setEmptyBlock('.menu-quantity');
    } else if (e.target.id && e.target.id === 'cancel') {
        setEmptyBlock('.menu-quantity');
    }
})

const documentPressKeyHandler = document.addEventListener('keydown', e => {
    if (e.key === ENTER_KEY) {
        e.preventDefault();
        setData(form, data);
        renderData(document.querySelector('#output-data'), data => collectDataByPattern(data));
        openPopup(popup);
        console.log(data);

        const popupCloseKeyHandler = document.addEventListener('keydown', function popupCloseKeyHandler(e) {
            if (e.key === 'Escape') {
                closePopup(popup);
                document.removeEventListener('keydown', popupCloseKeyHandler);
            }
        });

        const popupCloseHandler = popup.querySelector('.popup-close').addEventListener('click', (e) => {
            closePopup(popup);
            document.removeEventListener('keydown', popupCloseKeyHandler);
        });

    }
});

const submitClickHandler = document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    setData(form, data);
    renderData(document.querySelector('#output-data'), (data) => collectDataByPattern(data));
    openPopup(popup);
    console.log(data);

    const popupCloseKeyHandler = document.addEventListener('keydown', function popupCloseKeyHandler(e) {
        if (e.key === 'Escape') {
            closePopup(popup);
            document.removeEventListener('keydown', popupCloseKeyHandler);
        }
    });

    const popupCloseHandler = popup.querySelector('.popup-close').addEventListener('click', (e) => {
        closePopup(popup);
        document.removeEventListener('keydown', popupCloseKeyHandler);
    });
})

// ========================================================================

// ==== Function ====

function setData(form, data) {
    const currentTime = new Date().toUTCString();

    data.modeCorrection = setModeCorrection(form);

    data.aircraft.aircraftNumber = setAircraftNumber(form);
    data.aircraft.aircraftType = setAircraftType(data.aircraft.aircraftNumber, aircraftsList);
    data.aircraft.aircraftLayout = setAircraftLayout(data.aircraft.aircraftNumber, aircraftsList);

    data.airport.isArrivaled = setIsArrivaled(form);
    data.airport.airportTerminal = setAirportTerminal(data, airportsList);

    data.flight.flightNumberMain = setFlightNumberMain('flight-main');
    data.flight.flightType = setFlightType(form);

    data.time.currentDate = setCurrentDate(currentTime);
    data.time.currentSeason = setCurrentSeason(currentTime);
    data.time.originTimeMain = setOriginTimeMain(form);
    data.time.correctionTimeMain = setCorrectionTimeMain(form);
    data.time.originTimeSecondary = setOriginTimeSecondary(form);
    data.time.correctionTimeSecondary = setCorrectionTimeSecondary(form);
}

function setAirportNameMain(form) {
    return form.elements.airports.value || null;
}

function setAirportNameSecondary(form) {
    return form.elements.airportsDirect.value || null;
}

function setIsArrivaled(form) {
    return (+form.elements.question.value) ? true : false;
}

function setAirportTerminal(data, database) {
    return database.reduce((acc, el) => {
        if (el.airportName == data.airport.airportNameMain) {
            acc = el.airportTerminal;
        }
        return acc;
    }, null);;
}

function setFlightNumberMain(selector) {
    return document.getElementById(selector).value || null;
}

function setModeCorrection(form) {
    return (form.elements.correction.value === 'new') ? 'N' :
        (form.elements.correction.value === 'correction') ? 'C' : 'D';
}

function setFlightType(form) {
    return form.elements.flights.value.toUpperCase() || null;
}

function setOriginTimeMain(form) {
    return form.elements.originMain.value || null;
}

function setCorrectionTimeMain(form) {
    return form.elements.correctionMain.value || null;
}

function setOriginTimeSecondary(form) {
    return form.elements.originSecondary.value || null;
}

function setCorrectionTimeSecondary(form) {
    return form.elements.correctioSecondary.value || null;
}

function setCurrentDate(date) {
    return date.slice(5, 11)
        .split(' ')
        .join('')
        .toUpperCase();
}

function setCurrentSeason(currentTime) {
    return `W21 `; //TODO write function
}

function setAircraftNumber(form) {
    const selection = form.elements.aircrafts;
    return selection.options[selection.selectedIndex].value || null;
}

function setAircraftType(aircraftNumber, database) {
    return database.reduce((acc, el) => {
        if (el.aircraftNumber == aircraftNumber) {
            acc = el.type;
        }
        return acc;
    }, null);
}

function setAircraftLayout(aircraftNumber, database) {
    return database.reduce((acc, el) => {
        if (el.aircraftNumber == aircraftNumber) {
            acc = el.layout;
        }
        return acc;
    }, null);
}

function closePopup(popup) {
    popup.classList.add('hidden');
}

function openPopup(popup) {
    popup.classList.remove('hidden');
}

function vilidateData() {
    //  TODO будет отдельный js модуль под них
}

// === RenderData ===

function renderAircraftsList(form, data) {
    return data.map(elem => {
        const option = document.createElement('option');
        option.setAttribute('value', elem.aircraftNumber);
        option.textContent = elem.aircraftNumber;
        form.elements.aircrafts.appendChild(option);
    });
}

function renderAirportsList(form, data) {
    const airports = form.querySelector('.airports-base');

    return data.map(el => {
        const template = document.querySelector('#template-elements').content.firstElementChild.cloneNode(true);

        template.firstElementChild.id = el.airportName.toLowerCase();
        template.firstElementChild.name = 'airports';
        template.firstElementChild.value = el.airportName;
        template.firstElementChild.classList.add('airports-base__item');
        template.lastElementChild.textContent = el.airportName;
        template.lastElementChild.htmlFor = el.airportName.toLowerCase();

        airports.appendChild(template);
    });
}

function renderQuantityFlights(form, data) {
    const quantityFlights = form.querySelector('.menu-quantity');
    quantityFlights.innerHTML = '';

    return data.map(el => {
        const template = document.querySelector('#template-elements').content.lastElementChild.cloneNode(true);

        template.firstElementChild.id = `quantity${el}`;
        template.firstElementChild.name = 'quantity';
        template.firstElementChild.value = el;
        template.firstElementChild.classList.add('quantity-flights__item');
        template.lastElementChild.textContent = el.airportName;
        template.lastElementChild.htmlFor = `quantity${el}`;
        template.lastElementChild.textContent = el;

        quantityFlights.appendChild(template);
    });
}

function setEmptyBlock(selector) {
    form.querySelector(selector).innerHTML = '';
}

function showCorrectionSecondaryBlock(selector) {
    document.querySelector(selector).classList.remove('hidden');
}

function hideCorrectionSecondaryBlock(selector) {
    document.querySelector(selector).classList.add('hidden');
}

function dispayBlockTimeSecondary(selector) {
    document.querySelector(selector).classList.remove('none');

}

function noneDispayBlockTimeSecondary(selector) {
    document.querySelector(selector).classList.add('none');
}

function renderAirportsDirectionList(form, data, airportName) {
    const directionsList = data.filter(el => el.airportName == airportName ? el : null)[0].directionsList;
    const airports = form.querySelector('.airports-direction');
    airports.innerHTML = '';

    return directionsList.map(el => {
        const template = document.querySelector('#template-elements').content.firstElementChild.cloneNode(true);

        template.firstElementChild.id = el.toLowerCase();
        template.firstElementChild.name = 'airportsDirect';
        template.firstElementChild.value = el;
        template.lastElementChild.textContent = el;
        template.lastElementChild.htmlFor = el.toLowerCase();
        airports.appendChild(template);
    });
}

function renderData(outputElement, func) {
    outputElement.value = func(data).split('\n')
        .map(el => el.trim())
        .join('\n');
}

function collectDataByPattern(data) {
    function mutablePattern() {
        if (data.modeCorrection === 'N' && data.airport.isArrivaled) { // Прилетаем
            return `
              ${data.modeCorrection} 
              ${AC_ICAO_CODE}${data.flight.flightNumberMain} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.airport.airportNameSecondary}${data.time.originTimeMain} 
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal} 
              ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.aircraftNumber}/
              `;
        }
        if (data.modeCorrection === 'N' && !data.airport.isArrivaled) { // Вылетаем
            return `
              ${data.modeCorrection} 
              ${AC_ICAO_CODE}${data.flight.flightNumberMain} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.time.originTimeMain}${data.airport.airportNameSecondary}
              ${data.flight.flightType}/${PHRASE_TERMINAL_DEPARTURE}.${data.airport.airportTerminal} 
              ${PHRASE_AIRCRAFT_REGISTRATION}${data.aircraft.aircraftNumber}/
              `;
        }
        if (data.modeCorrection === 'D' && data.airport.isArrivaled) {
            return `
              ${data.modeCorrection} 
              ${AC_ICAO_CODE}${data.flight.flightNumberMain} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.airport.airportNameSecondary}${data.time.originTimeMain}
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}/
            `;
        }
        if (data.modeCorrection === 'D' && !data.airport.isArrivaled) {
            return `
              ${data.modeCorrection} 
              ${AC_ICAO_CODE}${data.flight.flightNumberMain} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.time.originTimeMain}${data.airport.airportNameSecondary}
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}/
        `;
        }
        if (data.modeCorrection === 'C' && data.airport.isArrivaled && data.flight.quantityFlights == 1) {
            return `
              C
              ${AC_ICAO_CODE}${data.flight.flightNumberMain}
              ${data.time.currentDate}
              ${data.airport.airportNameSecondary}${data.time.originTimeMain}
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}
              ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.aircraftNumber}/

              R
              ${AC_ICAO_CODE}${data.flight.flightNumberMain}
              ${data.time.currentDate}
              ${data.airport.airportNameSecondary}${data.time.correctionTimeMain}
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}
              ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.aircraftNumber}/
      `;
        }
        if (data.modeCorrection === 'C' && !data.airport.isArrivaled && data.flight.quantityFlights == 1) {
            return `
            C
            ${AC_ICAO_CODE}${data.flight.flightNumberMain}
            ${data.time.currentDate}
            ${data.time.originMain}${data.airport.airportNameSecondary}
            ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}
            ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.aircraftNumber}/

            R
            ${AC_ICAO_CODE}${data.flight.flightNumberMain}
            ${data.time.currentDate}
            ${data.airport.airportNameSecondary}${data.time.correctionTimeMain}
            ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}
            ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.aircraftNumber}/
    `;
        }
        if (data.modeCorrection === 'C' && data.flight.quantityFlights == 2) {
            return `
            C
            ${AC_ICAO_CODE}${data.flight.flightNumberMain}
            ${AC_ICAO_CODE}${data.flight.flightNumberSecond}
            ${data.time.currentDate}
            ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType}
            ${data.airport.airportNameSecondary}${data.time.originTimeMain}
            ${data.time.originSecondary}${data.airport.airportNameSecondary}
            ${data.flight.flightType}${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}${data.airport.airportTerminal}
            ${PHRASE_TERMINAL_DEPARTURE}.${data.airport.airportTerminal}/
            R
            ${AC_ICAO_CODE}${data.flight.flightNumberMain}
            ${AC_ICAO_CODE}${data.flight.flightNumberSecond}
            ${data.time.currentDate}
            ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType}

            ${data.airport.airportNameSecondary}${data.time.correctionMain}
            ${data.time.correctioSecondary}${data.airport.airportNameSecondary}
            ${data.flight.flightType}${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}${data.airport.airportTerminal}
            ${PHRASE_TERMINAL_DEPARTURE}.${data.airport.airportTerminal}/

            `
        }
    }
    return `
        ${ TYPE_TELEGRAM }
        ${ data.setting.emailResponse }
        ${ data.time.currentSeason }
        ${ data.time.currentDate }
        ${ data.airport.airportNameMain }
        ${ mutablePattern().split('\n').map(el => el.trim()).join(' ')}
        ${ data.setting.textAdded }
        `
}