import { airportsList, aircraftsList } from './DataBase.js';
// import validate from './validate.js';

// Variable

const currentTime = new Date().toUTCString();
const form = document.forms[0];

const airports = document.querySelectorAll('.airport');
const popup = document.querySelector('.popup');


// ========================================================================
const data = {
    airport: {
        airportNameDeparture: undefined,
        airportNameArrival: undefined,
        isSloted: undefined,
    },
    time: {
        currentDate: setCurrentDate(currentTime),
        currentSeason: setCurrentSeason(currentTime), // TODO написать функцию
        originTimeArrival: undefined, // input !
        originTimeDeparture: undefined, // input !
        correctionTimeDeparture: undefined, // input !
        correctionTimeArrival: undefined, // input !
    },
    aircraft: {
        number: undefined,
        aircraftType: undefined,
        aircraftLayout: undefined,
    },
    flight: {
        flight: undefined, // input
        kindFlight: undefined, // input
    },
    modeCorrection: undefined,
    setting: {
        emailResponse: 'ops1@azimuth.aero'.toUpperCase(),
        textAdded: 'GI BRGDS,=AZIMUTH=OPS',
    },
}

// Handlers

const submitHandler = document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    const outputText = popup.querySelector('textarea');
    data.aircraft.number = setnumber(form);
    data.aircraft.aircraftType = setAircraftType(data.aircraft.number, aircraftsList);
    data.aircraft.aircraftLayout = setAircraftLayout(data.aircraft.number, aircraftsList);
    data.modeCorrection = setModeCorrection(form);
    // popup.classList.remove('hidden');
    // outputText.value = renderData(data);
    console.log(data)
})

// ========================================================================

// === Logic ===
renderAircraftsList(form, aircraftsList);






// === Function === 
function setAirportName() {
    return;
}

function isSlotedAirport() {

}

function setModeCorrection(form) {
    const radio = form.elements.correction;
    return radio.value || null;
}

function setFlightNumber() {

}

function setKindFlight() {

}

function setOriginTimeDeparture() {

}

function setOriginTimeArrival() {

}

function setCorrectionTimeArrival() {

}

function setCorrectionTimeDeparture() {

}

function setCurrentDate(date) {
    return date.slice(5, 11)
        .split(' ')
        .join('')
        .toUpperCase();
}

function setCurrentSeason(currentTime) {
    return `
            W21 `; //TODO write function
}

function setnumber(form) {
    const selection = form.elements.aircrafts;
    return selection.options[selection.selectedIndex].value || null;
}

function setAircraftType(number, database) {
    return database.reduce((acc, el) => {
        if (el.number == number) {
            acc = el.type;
        }
        return acc;
    }, null);
}

function setAircraftLayout(number, database) {
    return database.reduce((acc, el) => {
        if (el.number == number) {
            acc = el.layout;
        }
        return acc;
    }, null);
}

function vilidateData() {
    //  TODO будет отдельный js модуль под них
}



// === RenderData ===
function renderAircraftsList(form, data) {
    return data.map(elem => {
        const option = document.createElement('option');
        option.setAttribute('value', elem.number);
        option.textContent = elem.aircraftNumber;
        form.elements.aircrafts.appendChild(option);
    });
}

// function renderAirportsList(form, data) {
//     return data.map(el => {
//         const airports = document.querySelector('.menu-airports');
//         const template = document.querySelector('.template-elements').content;
//         // airports.appendChild(template.)
//     });
// }

function renderData(data) {
    // if (data.modeCorrection == 'new')
    return `
            SCR $ { data.setting.emailResponse }
            $ { data.time.currentSeason }
            $ { data.time.currentDate }
            $ { data.airport.airportName }

            $ { data.aircraft.number }
            $ { data.aircraft.aircraftType }
            $ { data.aircraft.aircraftLayout }

            $ { data.setting.textAdded }
            `;
}