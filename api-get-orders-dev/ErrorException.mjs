export class ErrorException {
    /**
     * @param {Number} httpStatus 
     * @param {String} message 
     * @param {Object} error 
     */
    constructor(httpStatus, message, error) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.error = error;
    }
}
