import db from './DataBase.js';
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
        aircraftNumber: undefined,
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
const aircraftNumberHandler = form.elements.aircrafts.addEventListener('change', () => {
    const selection = form.elements.aircrafts;
    data.aircraft.aircraftNumber = selection.options[selection.selectedIndex].value;
});

const submitHandler = document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    const outputText = popup.querySelector('textarea');
    data.aircraft.aircraftType = setAircraftType(data.aircraft.aircraftNumber, db);
    data.aircraft.aircraftLayout = setAircraftLayout(data.aircraft.aircraftNumber, db);
    // popup.classList.remove('hidden');
    // outputText.value = renderData(data);
    console.log(data)
})

// ========================================================================

// === Logic ===
renderAircraftsList(form, db);






// === Function === 
function setAirportName() {
    return;
}

function isSlotedAirport() {

}

function setModeCorrection() {
    return;
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
    return `W21`; //TODO write function
}

function setAircraftType(aircraftNumber, database) {
    return database.aircraftsDataList.reduce((acc, el) => {
        if (el.aircraftNumber == aircraftNumber) {
            acc = el.type;
        }
        return acc;
    }, null);
}

function setAircraftLayout(aircraftNumber, database) {
    return database.aircraftsDataList.filter(el => {
        return el.aircraftNumber == data.aircraft.aircraftNumber;
    })[0].layout;
}

function vilidateData() {
    //  TODO будет отдельный js модуль под них
}

// === RenderData ===
function renderAircraftsList(form, data) {
    return data.aircraftsDataList.map(elem => {
        const option = document.createElement('option');
        option.setAttribute('value', elem.aircraftNumber);
        option.textContent = elem.aircraftNumber;
        form.elements.aircrafts.appendChild(option);
    });
}

function renderData(data) {
    // if (data.modeCorrection == 'new')
    return `
      SCR
      ${data.setting.emailResponse}
      ${data.time.currentSeason}
      ${data.time.currentDate}
      ${data.airport.airportName}
      
      ${data.aircraft.aircraftNumber}
      ${data.aircraft.aircraftType}
      ${data.aircraft.aircraftLayout}

      ${data.setting.textAdded}
    `;
}