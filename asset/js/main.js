import { airportsList, aircraftsList, flightsList, modesCorrection } from '../../db/DataBase.js';
// import { validateValue } from './validate.js';

// >>>>> Variable <<<<<
const data = {
    modeCorrection: modesCorrection.regular,
    aircraft: {
        number: undefined,
        type: undefined,
        layout: undefined,
    },
    airport: {
        nameDeparture: undefined,
        nameArrival: undefined,

        nameDepartureSecond: undefined,
        nameArrivalSecond: undefined,

        terminal: undefined,
    },
    flight: {
        number: undefined,
        type: undefined,
    },
    time: {
        currentDate: undefined,
        currentSeason: undefined,
        originPrimary: undefined,
        correctionPrimary: undefined,
    },
    setting: {
        email: undefined,
        textAdded: 'GI BRGDS, =AZIMUTH=OPS',
    },
};

const popup = document.querySelector('.popup');
const btnAddFlight = document.querySelector('.add-flight');
const TYPE_TELEGRAM = 'SCR';
const AC_ICAO_CODE = 'A4';
const PHRASE_TERMINAL_ARRIVAL = 'TA';
const PHRASE_TERMINAL_DEPARTURE = 'TD';
const PHRASE_AIRCRAFT_REGISTRATION = 'RE';

const aircraftNumberInput = document.querySelector('.aircraft-number__input');
// >>>> HANDLERS <<<< 

document.addEventListener('DOMContentLoaded', e => {
    renderAircraftsList(aircraftNumberInput, aircraftsList);
})

document.addEventListener('input', e => {
    if (e.target.classList.contains('flight-number__input') && /^\d{4}$/.test(e.target.value)) {
        console.log('NEW OR CANCEL')
    }

    if (e.target.classList.contains('flight-number__input') && /^\d{3}$/.test(e.target.value)) {
        flightsList.forEach(el => {
            if (e.target.value == Object.keys(el)) {;;
                fillInputField(document.querySelector('.airport-primary__input'),
                    data.airport.nameDeparture = el[e.target.value].airportDeparture);
                fillInputField(document.querySelector('.airport-secondary__input'),
                    data.airport.nameArrival = el[e.target.value].airportArrival);
                fillInputField(document.querySelector('.time-primary-origin__input'),
                    data.time.originPrimary = el[e.target.value].originTime);
                fillInputField(document.querySelector('.email__input'),
                    data.setting.email = airportsList.reduce((acc, el) => {
                        if (el.airportName === data.airport.nameArrival && el.isSloted) {
                            acc = el.airportEmail;
                        } else if (el.airportName === data.airport.nameDeparture && el.isSloted) {
                            acc = el.airportEmail;
                        }
                        return acc;
                    }, null));
            }
        });

        data.flight.number = e.target.value;
        data.flight.type = setFlightType(data.flight.number);
        data.airport.terminal = setAirportTerminal(data, airportsList);

        document.addEventListener('input', e => {
            if (e.target.classList.contains('time-primary-correction__input') && /^\d{4}$/.test(e.target.value)) {
                data.time.correctionPrimary = e.target.value;
            }
            if (e.target.classList.contains('time-primary-origin__input') && /^\d{4}$/.test(e.target.value)) {
                data.time.originPrimary = e.target.value;
            }
        })
    } else if (e.target.classList.contains('flight-number__input') && !/^\d{3}$/.test(e.target.value)) {}

    if (e.target.classList.contains('flight-number-two__input')) {

    }
});

document.addEventListener('change', e => {
    if (e.target.classList.contains('aircraft-number__input')) {
        if (data.aircraft.number = e.target.value) {
            data.aircraft.type = setAircraftType(data.aircraft.number, aircraftsList);
            data.aircraft.layout = setAircraftLayout(data.aircraft.number, aircraftsList);
        }
    }
    if (e.target.name === 'mode') {
        setModeCorrection(data, e.target.id, modesCorrection);
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

    if (e.target.classList.contains('add-flight') && e.target.type === 'button') {
        // TODO
    }

    if (!e.target.classList.contains('popup__textarea')) {
        closePopup(popup);
    }

    if (e.target.classList.contains('button__add-flight')) {
        noneDisplayElement(document.querySelector('.info__add-flight'));
        displayElement(document.querySelector('.flight-number-two'));
    }
})

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        setData(data);
        popup.querySelector('textarea').textContent = collectDataByPattern(data, airportsList)
            .split('\n')
            .map(el => el.trim())
            .join('\n');
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

// ========================================================================

//  >>>>> FUNCTIONS <<<<<

function setData(data) {
    const currentTime = new Date().toUTCString();
    data.time.currentDate = setCurrentDate(currentTime);
    data.time.currentSeason = setCurrentSeason(currentTime);

    data.airport.terminal = setAirportTerminal(data, airportsList);

    data.flight.type = setFlightType(data.flight.number);
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

function setModeCorrection(data, value, database) {
    return value === 'new' ? data.modeCorrection = database.new :
        value === 'cancel' ? data.modeCorrection = database.cancel :
        data.modeCorrection = database.regular;
}

function setAirportTerminal(data, database) {
    const airportDeparture = data.airport.airportDeparture;
    const airportArrival = data.airport.airportArrival;

    return airportsList.filter(el => el.isSloted)
        .reduce((acc, el) => {
            if (el.airportName === airportDeparture || el.airportName === airportArrival) {
                acc = el.airportTerminal;
            }
            return acc;
        }).airportTerminal;
}

function setAircraftType(aircraftNumber, database) {
    return database.reduce((acc, el) => {
        if (el.number == aircraftNumber) {
            acc = el.type;
        }
        return acc;
    }, null);
}

function setAircraftLayout(aircraftNumber, database) {
    return database.reduce((acc, el) => {
        if (el.number == aircraftNumber) {
            acc = el.layout;
        }
        return acc;
    }, null);
}

function setFlightType(flightNumber) {
    const flightTypesList = {
        regular: 'J',
        charter: 'D',
        empty: 'P',
    };
    return /^\d{3}$/.test(flightNumber) ? flightTypesList.regular : /^9\d{3}$/.test(flightNumber) ?
        flightTypesList.charter : flightTypesList.empty;
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
        option.setAttribute('value', elem.number);
        option.textContent = elem.number;
        elementDOM.appendChild(option);
    });
}

function fillInputField(elementDOM, data) {
    elementDOM.value = data;
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

function collectDataByPattern(data, airportsList) {
    function mutablePattern() {
        const airport = airportsList.filter(el => el.isSloted).map(el => el.airportName)
            .includes(data.airport.nameDeparture) ?
            data.airport.nameArrival :
            data.airport.nameDeparture;
        if (data.modeCorrection === 'C' &&
            data.airport.nameDepartureSecond === undefined &&
            data.airport.nameArrivalSecond === undefined) {
            return `
                    ${modesCorrection.regular}
                    ${AC_ICAO_CODE}${data.flight.number}
                    ${data.time.currentDate}
                    ${data.time.originPrimary}${airport}
                    ${data.flight.type}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.terminal}
                    ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.number}/ 

                    ${modesCorrection.regularRequest}
                    ${AC_ICAO_CODE}${data.flight.number}
                    ${data.time.currentDate}
                    ${data.airport.nameArrival}${data.time.correctionPrimary}
                    ${data.flight.type}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.terminal}
                    ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.number}/
  `;
        }
        if (data.modeCorrection === 'C') {
            return `
          C
          ${AC_ICAO_CODE}${data.flight.flightNumberMain}
          ${AC_ICAO_CODE}${data.flight.flightNumberSecond}
          ${data.time.currentDate}
          ${data.aircraft.layout}${data.aircraft.type}
          ${data.airport.nameArrival}${data.time.originTimeMain}
          ${data.time.originSecondary}${data.airport.nameArrival}
          ${data.flight.flightType}${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}${data.airport.terminal}
          ${PHRASE_TERMINAL_DEPARTURE}.${data.airport.terminal}/
          R
          ${AC_ICAO_CODE}${data.flight.flightNumberMain}
          ${AC_ICAO_CODE}${data.flight.flightNumberSecond}
          ${data.time.currentDate}
          ${data.aircraft.layout}${data.aircraft.type}

          ${data.airport.nameArrival}${data.time.correctionMain}
          ${data.time.correctioSecondary}${data.airport.nameArrival}
          ${data.flight.flightType}${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}${data.airport.terminal}
          ${PHRASE_TERMINAL_DEPARTURE}.${data.airport.terminal}/
          `
        }
    }
    return `
      ${TYPE_TELEGRAM}
      ${data.setting.email.toUpperCase()}
      ${data.time.currentSeason}
      ${data.time.currentDate}
      ${data.airport.nameDeparture}
      ${mutablePattern().split('\n')
      .map(el => el.trim())
      .join(' ')
      .split('/ ')
      .join('/\n')}
      ${data.setting.textAdded}
      `
}