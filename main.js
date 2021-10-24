import StaticData from './staticData.js';
// import validate from './validate.js';

const currentTime = new Date().toUTCString();
const airports = document.querySelectorAll('.airport');
const popup = document.querySelector('.popup');
const outputText = popup.querySelector('textarea');
const form = document.forms[0];

const data = {
    airport: {
        airportNameDeparture: '',
        airportNameArrival: '',
        isSloted: false,
    },
    time: {
        currentDate: currentTime.slice(5, 11)
            .split(' ')
            .join('')
            .toUpperCase(),
        currentSeason: setCurrentSeason(currentTime), // TODO написать функцию
        originTimeArrival: '', // input !
        originTimeDeparture: '', // input !
        correctionTimeDeparture: '', // input !
        correctionTimeArrival: '', // input !
    },
    aircraft: {
        aircraft: setAircraftLayout(form),
        typeAircraft: setAircraftType(form, StaticData),
        layoutAircraft: setAircraftLayout(form, StaticData),
    },
    flight: {
        flight: setFlightNumber(form), // input
        kindFlight: setKindFlight(form), // input
    },
    modeCorrection: setModeCorrection(form),
    setting: {
        emailResponse: 'ops1@azimuth.aero'.toUpperCase(),
        textAdded: 'GI BRGDS,=AZIMUTH=OPS',
    },
}

// Handlers
form.elements.aircrafts.addEventListener('change', (e) => { console.log(e.type) });



// 
// Logic
renderAircraftsList(form, StaticData);
outputText.value = renderData(data);

// 
function setAirportName() {

}

function isSlotedAirport() {

}

function setModeCorrection() {

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

function setCurrentSeason(currentTime) {
    return `W21`; //TODO write function
}

function setAircraftType(data) {
    if (form.elements.type.value == 'on') {
        return 'SU9';
    } else throw new Error('Обратитесь за доработкой'); //TODO Создать отдельный клас ошибок
}

function setAircraftLayout(form, data) {
    const activeSelect = form.elements.aircrafts
    return;
}

function vilidateData() {
    //  ,удет отдельный js модуль под них
}

function renderAircraftsList(form, data) {
    let i = 0;
    return data.aircraftsDataList.map(elem => {
        const option = document.createElement('option');
        option.setAttribute('name', elem.aircraftNumber);
        option.textContent = elem.aircraftNumber;
        form.elements.aircrafts.appendChild(option);
    });
}

function renderData(data) {
    // if (data.modeCorrection == 'new')
    return `
      SCR
      ${data.emailResponse}
      ${data.currentSeason}
      ${data.currentDate}
      ${data.airportName}
      
      ${data.textAdded}
    `;
}