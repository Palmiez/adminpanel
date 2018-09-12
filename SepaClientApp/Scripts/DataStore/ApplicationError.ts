class ApplicationError{
    private errorMessage: string;
    get hasError(): boolean { return this.errorMessage.length > 0; }
    get message(): string { return this.errorMessage; }

    setError(error: Error) { this.errorMessage = error.message;  }
}