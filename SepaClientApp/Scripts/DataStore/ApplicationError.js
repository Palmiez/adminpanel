var ApplicationError = /** @class */ (function () {
    function ApplicationError() {
    }
    Object.defineProperty(ApplicationError.prototype, "hasError", {
        get: function () { return this.errorMessage.length > 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationError.prototype, "message", {
        get: function () { return this.errorMessage; },
        enumerable: true,
        configurable: true
    });
    ApplicationError.prototype.setError = function (error) { this.errorMessage = error.message; };
    return ApplicationError;
}());
//# sourceMappingURL=ApplicationError.js.map