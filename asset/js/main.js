import { airportsList, aircraftsList, flightsList, modeCorrectionList } from '../../db/DataBase.js';
// import { validateValue } from './validate.js';

// >>>>> Variable <<<<<
const data = {
    modeCorrection: undefined,
    aircraft: {
        aircraftNumber: undefined,
        aircraftType: undefined,
        aircraftLayout: undefined,
    },
    airport: {
        airportNameDeparture: undefined,
        airportNameArrival: undefined,
        airportNameDepartureSecond: undefined,
        airportNameArrivalSecond: undefined,
        airportTerminal: undefined,
    },
    flight: {
        flightNumber: undefined,
        flightType: undefined,
    },
    time: {
        currentDate: undefined,
        currentSeason: undefined,
    },
    setting: {
        emailResponse: 'ops1@azimuth.aero'.toUpperCase(),
        textAdded: 'GI BRGDS,=AZIMUTH=OPS',
    },
};

const popup = document.querySelector('.popup');
const TYPE_TELEGRAM = 'SCR';
const AC_ICAO_CODE = 'A4';
const PHRASE_TERMINAL_ARRIVAL = 'TA';
const PHRASE_TERMINAL_DEPARTURE = 'TD';
const PHRASE_AIRCRAFT_REGISTRATION = 'RE';

const templateElementInput = {
    selectorTemplate: '#template-elements',
    selectorTemplateElement: '.label-input-text'
}

const elementFlightOutput = {
    classNameBlock: 'data__output-flight flight-info',
    id: 'data-output-flight',
    classNameLabel: 'flight-info__airport-departure-label',
    classNameInput: 'flight-info__airport-departure-input',
    contentLabel: 'Аэропорт вылета',
    valueInput: 'test',
}

// >>>> HANDLERS <<<< 

document.addEventListener('input', e => {
    if (e.target.classList.contains('flight-number__input') && /^\d{4}$/.test(e.target.value)) {
        console.log('NEW OR CANCEL')
    }

    if (e.target.classList.contains('flight-number__input') && /^\d{3}$/.test(e.target.value)) {
        new Promise(resolve => {
                data.flight.flightNumber = e.target.value;
                resolve();
            })
            .then(() => {
                flightsList.forEach(el => {
                    if (el[data.flight.flightNumber]) {
                        elementFlightOutput.valueInput = el[data.flight.flightNumber].airportDeparture;
                        console.log(elementFlightOutput.valueInput)
                    }
                })
            })
            // data.flight.flightNumber = e.target.value;
        renderAircraftsList(document.querySelector('.aircraft-number__input'), aircraftsList);
        displayElement(document.querySelector('.aircraft-number'));
        renderData(document.querySelector('.data'), generatePattern(templateElementInput, elementFlightOutput));
    } else if (e.target.classList.contains('flight-number__input') && !/^\d{3}$/.test(e.target.value)) {
        noneDisplayElement(document.querySelector('.aircraft-number'));
    }
});

document.addEventListener('change', e => {
    if (e.target.classList.contains('aircraft-number__input')) {
        data.aircraft.aircraftNumber = e.target.value;

    }
})

document.addEventListener('click', e => {
    if (e.target.classList.contains('menu__button') && e.target.type === 'submit') {
        // setData(data);
        openPopup(popup);
        const popupCloseKeyHandler = document.addEventListener('keydown', function popupCloseKeyHandler(e) {
            if (e.key === 'Escape') {
                closePopup(popup);
                document.removeEventListener('keydown', popupCloseKeyHandler);
            }
        });

        const popupCloseHandler = document.querySelector('.popup-close').addEventListener('click', (e) => {
            closePopup(popup);
            document.removeEventListener('keydown', popupCloseKeyHandler);
        });
    }
})

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        // setData(form, data);
        // renderData(document.querySelector('#output-data'), data => collectDataByPattern(data));
        openPopup(popup);

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

// ========================================================================

//  >>>>> FUNCTIONS <<<<<

function setData(data) {
    const currentTime = new Date().toUTCString();
    data.time.currentDate = setCurrentDate(currentTime);
    data.time.currentSeason = setCurrentSeason(currentTime);

    if (data.aircraft.aircraftNumber) {
        data.aircraft.aircraftType = setAircraftType(data.aircraft.aircraftNumber, aircraftsList);
        data.aircraft.aircraftLayout = setAircraftLayout(data.aircraft.aircraftNumber, aircraftsList);
    }

    // data.modeCorrection = setModeCorrection(form);

    data.airport.airportTerminal = setAirportTerminal(data, airportsList);

    data.flight.flightType = setFlightType(data.flight.flightNumber);
}

function displayElement(elementDOM) {
    elementDOM.classList.remove(`none`);
}

function noneDisplayElement(elementDOM) {
    elementDOM.classList.add(`none`);
}

function setEmptyBlock(elementDOM) {
    elementDOM.innerHTML = '';
}

function closePopup(element) {
    element.classList.add('hidden');
}

function openPopup(element) {
    element.classList.remove('hidden');
}

function setAirportTerminal(data, database) {

}

function setAircraftType(aircraftNumber, database) {
    return database.reduce((acc, el) => {
        if (el.aircraftNumber == aircraftNumber) {
            acc = el.aircraftType;
        }
        return acc;
    }, null);
}

function setAircraftLayout(aircraftNumber, database) {
    return database.reduce((acc, el) => {
        if (el.aircraftNumber == aircraftNumber) {
            acc = el.aircraftLayout;
        }
        return acc;
    }, null);
}

function setFlightType(flightNumber) {
    const flightTypesList = [
        { regular: 'J' },
        { Cancel: 'D' },
        { Empty: 'P' },
    ];
    return /^\d{3}$/.test(flightNumber) ? flightTypesList.regular : null;
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

function renderAircraftsList(elementDOM, data) {
    return data.map(elem => {
        const option = document.createElement('option');
        option.setAttribute('value', elem.aircraftNumber);
        option.textContent = elem.aircraftNumber;
        elementDOM.appendChild(option);
    });
}

function renderData(elementDOM, pattern) {
    elementDOM.appendChild(pattern);
}

function generatePattern({ selectorTemplate, selectorTemplateElement }, { classNameBlock, id, classNameLabel, classNameInput, contentLabel, valueInput }) {
    const pattern = document.querySelector(selectorTemplate).content.querySelector(selectorTemplateElement).cloneNode(true);
    pattern.className = classNameBlock;
    pattern.firstElementChild.htmlFor = id;
    pattern.firstElementChild.textContent = contentLabel;
    pattern.firstElementChild.className = classNameLabel;
    pattern.lastElementChild.id = id;
    pattern.lastElementChild.className = classNameInput;
    pattern.lastElementChild.value = valueInput;

    return pattern;
}

function collectDataByPattern(data) {
    function mutablePattern() {
        if (data.modeCorrection === 'N' && data.airport.isArrivaled) {
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
        if (data.modeCorrection === 'N' && !data.airport.isArrivaled) {
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