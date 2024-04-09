export class ErrorException {
    /**
     * @param {number} httpStatus 
     * @param {string} message 
     * @param {object} error 
     */
    constructor(httpStatus, message, error) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.error = error;
    }
}
