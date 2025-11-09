class ApiError extends Error {
    constructor( 
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = (new Error()).stack
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;

        // and to make debugging easier and error class useful
        if(stack) {
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        };
    }
}

export { ApiError };