class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message)
        this.statuscode = statuscode
        Error.captureStackTrace(this,this.constuctor)
    }
}

export {
    ErrorHandler
}