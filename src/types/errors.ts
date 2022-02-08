

enum UserServiceNames { 
    UNIDENTIFIED_ERROR = 'UNIDENTIFIED_ERROR',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
}

interface ServiceErrorInfo {
    code: string
    status: number
    message: string
    service: string
}

export const UserServiceErrors : Record<UserServiceNames, ServiceErrorInfo> = {
    [UserServiceNames.UNIDENTIFIED_ERROR]: { code: 'S00', status: 500 , message: 'Unidentified error', service: 'user.service' },
    [UserServiceNames.USER_NOT_FOUND]: { code: 'S01', status: 404, message: 'User not found', service: 'user.service' },
}

export class AuthError extends Error {
    status: number = 401
    constructor(message: string, status: number) {
        super(message)
        this.name = 'Error'
        this.status = status
    }
}

export class ServiceError extends Error {
    code: string = "00"
    status: number = 500
    serviceName: string = "unidentified service"
    constructor(errorInfo: ServiceErrorInfo) {
        super(errorInfo.message)
        this.name = 'Service Error'
        this.code = errorInfo.code
        this.status = errorInfo.status
        this.serviceName = errorInfo.service
    }
}