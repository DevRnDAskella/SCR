import airportsData from './staticData.js';
import validate from './validate.js';

const currentTime = new Date().toUTCString();
const airports = document.querySelectorAll('.airport');


const data = {
    airportName: '',
    isSloted: false,
    modeCorrection: '',
    currentDate: currentTime.slice(5, 11)
        .split(' ')
        .join('')
        .toUpperCase(),
    currentSeason: 'W21', // TODO написать функцию
    flight: '', // input
    kindFlight: '', // input
    originTimeArrival: '', // input !
    originTimeDeparture: '', // input !
    correctionTimeDeparture: '', // input !
    correctionTimeArrival: '', // input !
    typeAircraft: 'SU9', // input !
    layoutAircraft: '100/103', // input !
    emailResponse: 'ops1@azimuth.aero'.toUpperCase(),
    textAdded: 'GI BRGDS,=AZIMUTH=OPS',
}


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

function setCorrectionTimeArrival() {

}

function vilidateData() {
    //  ,удет отдельный js модуль под них
}

function renderData(data) {
    if (data.modeCorrection == 'new')
        return `
      SCR
      ${data.emailResponse}
      ${data.currentSeason}
      ${data.currentDate}
      ${data.airportName}
      
      ${data.textAdded}
    `;
}