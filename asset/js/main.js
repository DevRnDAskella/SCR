import { airportsList, aircraftsList } from '../../db/DataBase.js';
import { validateAll } from './validate.js';

// === Variable ===

const form = document.forms[0];
const popup = document.querySelector('.popup');

// ========================================================================
const data = {
    airport: {
        airportNameDeparture: undefined,
        airportNameArrival: undefined,
        isSloted: undefined,
    },
    time: {
        currentDate: undefined,
        currentSeason: undefined,
        originTimeArrival: undefined,
        originTimeDeparture: undefined,
        correctionTimeDeparture: undefined,
        correctionTimeArrival: undefined,
    },
    aircraft: {
        aircraftNumber: undefined,
        aircraftType: undefined,
        aircraftLayout: undefined,
    },
    flight: {
        flightType: undefined,
        flightKind: undefined,
    },
    modeCorrection: undefined,
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
        data.airport.airportNameDeparture = setAirportNameDeparture(form);
        let promise = new Promise((resolve, reject) => {
            resolve(renderAirportsDirectionList(form, airportsList, data.airport.airportNameDeparture));
        }).then(() => {
            for (const item of form.elements.airportsDirect) {
                const radioChangeHandler = item.addEventListener('change', () => {
                    data.airport.airportNameArrival = setAirportNameArrival(form);
                })
            }
        })
    })
}

const documentPressKeyHandler = document.addEventListener('keydown', e => {
    e.preventDefault();
    if (e.key === 'Enter') {
        e.preventDefault();
        setData(form, data);
        renderData(document.querySelector('#output-data'), data);
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
    renderData(document.querySelector('#output-data'), data);
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

// === Function ===

function setData(form, data) {
    const currentTime = new Date().toUTCString();

    data.aircraft.aircraftNumber = setAircraftNumber(form);
    data.aircraft.aircraftType = setAircraftType(data.aircraft.aircraftNumber, aircraftsList);
    data.aircraft.aircraftLayout = setAircraftLayout(data.aircraft.aircraftNumber, aircraftsList);

    data.modeCorrection = setModeCorrection(form);

    data.airport.isSloted = setIsSlotedInitialAirport(form);

    data.flight.flightType = setFlightType(form);

    data.time.currentDate = setCurrentDate(currentTime);
    data.time.currentSeason = setCurrentSeason(currentTime);
    data.time.originTimeDeparture = setOriginTimeDeparture(form);
    data.time.originTimeArrival = setOriginTimeArrival(form);
    data.time.correctionTimeDeparture = setCorrectionTimeDeparture(form);
    data.time.correctionTimeArrival = setCorrectionTimeArrival(form);
}

function setAirportNameDeparture(form) {
    return form.elements.airports.value || null;
}

function setAirportNameArrival(form) {
    return form.elements.airportsDirect.value || null;
}

function setIsSlotedInitialAirport(form) {
    return form.elements.question.value ? false : true || null;
}

function setModeCorrection(form) {
    return form.elements.correction.value || null;
}

function setFlightType(form) {
    return form.elements.flights.value || null;
}

function setFlightKind() {

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

function renderData(outputElement, data) {
    outputElement.value = `
SCR
${data.setting.emailResponse}
${data.time.currentSeason}
${data.time.currentDate}
${data.airport.airportName}

${data.aircraft.aircraftNumber}
${data.aircraft.aircraftType}
${data.aircraft.aircraftLayout}

${data.setting.textAdded}`;
}