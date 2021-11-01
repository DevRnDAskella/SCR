export const airportsList = [{
        airportName: 'VKO',
        airportTerminal: 'A',
        isSloted: true,
        airportEmail: 'coordination@vnukovo.ru',
        priority: 1,
    },
    {
        airportName: 'IST',
        airportTerminal: 'A',
    },
    {
        airportName: 'SIP',
        airportTerminal: 'A',
    },
    {
        airportName: 'AER',
        airportTerminal: 'A',
    },
    {
        airportName: 'MSQ',
        airportTerminal: 'A',
    },
];

export const modeCorrectionList = [
    { new: 'N' },
    { correctionOrigin: 'C' },
    { correctionRequest: 'R' },
    { cancel: 'D' },
];

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
        originTime: '0435',
    }
}, {
    291: {
        airportDeparture: 'ROV',
        airportArrival: 'VKO',
        originTime: '0435',
    }
}, ];

export const aircraftsList = [
    { aircraftNumber: 89036, aircraftLayout: 103, aircraftType: 'SU9' },
    { aircraftNumber: 89079, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89080, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89085, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89093, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89094, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89095, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89096, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89120, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89121, aircraftLayout: 103, aircraftType: 'SU9' },
    { aircraftNumber: 89136, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89139, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89149, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89179, aircraftLayout: 100, aircraftType: 'SU9' },
    { aircraftNumber: 89180, aircraftLayout: 103, aircraftType: 'SU9' },

];

export default { airportsList, aircraftsList, flightsList, modeCorrectionList };