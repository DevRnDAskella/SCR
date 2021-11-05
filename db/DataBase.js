export const airportsList = [{
  airportName: 'VKO',
  airportTerminal: 'A',
  isSloted: true,
  airportEmail: 'coordination@vnukovo.ru',
  priority: 1,
},
{
  airportName: 'ROV',
  airportTerminal: 'B',
  isSloted: false,
  airportEmail: 'scr@rostov.ru',
  priority: 0,
},
{
  airportName: 'IST',
  airportTerminal: 'A',
  isSloted: true,
  airportEmail: 'coordination@vnukovo.ru',
  priority: 1,
},
{
  airportName: 'SIP',
  airportTerminal: 'A',
  isSloted: true,
  airportEmail: 'coordination@vnukovo.ru',
  priority: 1,
},
{
  airportName: 'AER',
  airportTerminal: 'A',
  isSloted: true,
  airportEmail: 'coordination@vnukovo.ru',
  priority: 1,
},
{
  airportName: 'MSQ',
  airportTerminal: 'A',
  isSloted: true,
  airportEmail: 'coordination@vnukovo.ru',
  priority: 1,
},
];

export const modesCorrection = {
  new: 'N',
  regular: 'C',
  regularRequest: 'R',
  cancel: 'D',
};

export const flightsList = [{
  201: {
    airportDeparture: 'ROV',
    airportArrival: 'VKO',
    originTime: '0435',
  }
}, {
  202: {
    airportDeparture: 'VKO',
    airportArrival: 'ROV',
    originTime: '0835',
  }
}, {
  291: {
    airportMain: 'VKO',
    airportSecondary: 'ROV',
    originTime: '0435',
  }
},];

export const aircraftsList = [
  { number: 89036, layout: 103, type: 'SU9' },
  { number: 89079, layout: 100, type: 'SU9' },
  { number: 89080, layout: 100, type: 'SU9' },
  { number: 89085, layout: 100, type: 'SU9' },
  { number: 89093, layout: 100, type: 'SU9' },
  { number: 89094, layout: 100, type: 'SU9' },
  { number: 89095, layout: 100, type: 'SU9' },
  { number: 89096, layout: 100, type: 'SU9' },
  { number: 89120, layout: 100, type: 'SU9' },
  { number: 89121, layout: 103, type: 'SU9' },
  { number: 89136, layout: 100, type: 'SU9' },
  { number: 89139, layout: 100, type: 'SU9' },
  { number: 89149, layout: 100, type: 'SU9' },
  { number: 89179, layout: 100, type: 'SU9' },
  { number: 89180, layout: 103, type: 'SU9' },

];

export default { airportsList, aircraftsList, flightsList, modesCorrection };