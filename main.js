import airportsData from './staticData.js';


const airports = document.querySelectorAll('.airport');
const baseSet = document.querySelectorAll('.btn-setting');
const currentTime = new Date().toUTCString();
const data = {
  airportName: '',
  currentDate: currentTime.slice(5, 11)
    .split(' ')
    .join('')
    .toUpperCase(),
  currentSeason: '',
  flight: '',
  kindFlight: '',
  originTimeArrival: '',
  originTimeDeparture: '',
  correctionTimeDeparture: '',
  correctionTimeArrival: '',
  typeAircraft: 'SU9',
  layoutAircraft: '100/103',
}

for (const airport of airports) {
  airport.addEventListener('click', () => {
    for (const airport of airports) {
      airport.classList.remove('btn-press');
    }
    airport.classList.add('btn-press');

    data.airportName = airport.textContent;
  })
}


console.log(data.currentDate);

function vilidateData() {

}

function renderData(data) {

}