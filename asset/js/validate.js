export function validateAll() {
    const flightNumInput = document.querySelector('.flight-number');
    flightNumInput.addEventListener('invalid', (e) => {
        if (flightNumInput.validity.tooShort) {
            flightNumInput.setCustomValidity('TEST');
        }
    })
}

export default { validateAll }

// export function validateInputArrivaledFlightNumber() {

// }

// export function validateInputDeparturedFlightNumber() {

// }

// export function validateInputOriginTimeDeparture() {

// }

// export function validateInputOriginTimeArrival() {

// }

// export function validateInputCorrectionTimeDeparture() {

// }

// export function validateInputCorrectionTimeDeparture() {

// }