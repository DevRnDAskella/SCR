import { airportsList, aircraftsList } from '../../db/DataBase.js';
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

// ============================= TEST


// ============================= TEST


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
        flightNumber: undefined,
        flightType: undefined,
    },
    time: {
        currentDate: undefined,
        currentSeason: undefined,
        originTimeArrival: undefined,
        originTimeDeparture: undefined,
        correctionTimeDeparture: undefined,
        correctionTimeArrival: undefined,
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
        render();
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

    data.flight.flightNumber = setFlightNumber(form);
    data.flight.flightType = setFlightType(form);

    data.time.currentDate = setCurrentDate(currentTime);
    data.time.currentSeason = setCurrentSeason(currentTime);
    data.time.originTimeDeparture = setOriginTimeDeparture(form);
    // data.time.originTimeArrival = setOriginTimeArrival(form);
    // data.time.correctionTimeDeparture = setCorrectionTimeDeparture(form);
    // data.time.correctionTimeArrival = setCorrectionTimeArrival(form);
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
            acc = el.terminal;
        }
        return acc;
    }, null);;
}

function setFlightNumber(form) {
    return document.getElementById('flight-departure').value || null;
}

function setModeCorrection(form) {
    return (form.elements.correction.value === 'new') ? 'N' :
        (form.elements.correction.value === 'correction') ? 'C' : 'D';
}

function setFlightType(form) {
    return form.elements.flights.value.toUpperCase() || null;
}

function setOriginTimeDeparture(form) {
    return form.elements.originsDeparture.value || null;
}

function setOriginTimeArrival(form) {
    return form.elements.originsArrival.value || null;
}

function setCorrectionTimeDeparture(form) {
    return form.elements.correctionDeparture.value || null;
}

function setCorrectionTimeArrival(form) {
    return form.elements.correctionArrival.value || null;
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
    return data.map(el => {
        const airports = form.querySelector('.airports-base');
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

function render(form, data) {
    return daata.map(el => {
        const template = document.querySelector('#template-elements').content.lastElementChild.cloneNode(true);

    });
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
              ${AC_ICAO_CODE}${data.flight.flightNumber} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.airport.airportNameSecondary}${data.time.originTimeDeparture} 
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal} 
              ${PHRASE_AIRCRAFT_REGISTRATION}.${data.aircraft.aircraftNumber}/
              `;
        }
        if (data.modeCorrection === 'N' && !data.airport.isArrivaled) { // Вылетаем
            return `
              ${data.modeCorrection} 
              ${AC_ICAO_CODE}${data.flight.flightNumber} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.time.originTimeDeparture}${data.airport.airportNameSecondary}
              ${data.flight.flightType}/${PHRASE_TERMINAL_DEPARTURE}.${data.airport.airportTerminal} 
              ${PHRASE_AIRCRAFT_REGISTRATION}${data.aircraft.aircraftNumber}/
              `;
        }
        if (data.modeCorrection === 'D' && data.airport.isArrivaled) {
            return `
              ${data.modeCorrection} 
              ${AC_ICAO_CODE}${data.flight.flightNumber} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.airport.airportNameSecondary}${data.time.originTimeDeparture}
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}/
            `;
        }
        if (data.modeCorrection === 'D' && !data.airport.isArrivaled) {
            return `
              ${data.modeCorrection} 
              ${AC_ICAO_CODE}${data.flight.flightNumber} 
              ${data.time.currentDate} 
              ${data.aircraft.aircraftLayout}${data.aircraft.aircraftType} 
              ${data.time.originTimeDeparture}${data.airport.airportNameSecondary}
              ${data.flight.flightType}/${PHRASE_TERMINAL_ARRIVAL}.${data.airport.airportTerminal}/
        `;
        }
        if (data.modeCorrection === 'C' && data.airport.isArrivaled) {
            return `
      `;
        }
        if (data.modeCorrection === 'C' && !data.airport.isArrivaled) {
            return `
    `;
        }
    }
    return `
        ${ TYPE_TELEGRAM }
        ${ data.setting.emailResponse }
        ${ data.time.currentSeason }
        ${ data.time.currentDate }
        ${ data.airport.airportNameMain }
        ${ mutablePattern().split('\n').map(el => el.trim()).join(' ') }
        ${ data.setting.textAdded }
        `
}