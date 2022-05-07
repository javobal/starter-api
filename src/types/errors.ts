export interface ServiceErrorInfo {
    code: string
    service: string
    publicMessage: string
}

export const UserServiceErrors: Record<string, ServiceErrorInfo> = {
    'UNIDENTIFIED_ERROR': {
        code: 'UNIDENTIFIED_ERROR',
        publicMessage: 'Unidentified error',
        service: 'user',
    },
    'USER_NOT_FOUND': {
        code: 'USER_NOT_FOUND',
        publicMessage: 'User not found',
        service: 'user',
    },
    'CHECK_ERROR': {
        code: 'CHECK_ERROR',
        publicMessage: 'There was a problem checking this user',
        service: 'user',
    },
    'USER_LIST_ERROR': {
        code: 'USER_LIST_ERROR',
        publicMessage: 'There was a problem listing users',
        service: 'user'
    },
    'USER_GET_ERROR': {
        code: 'USER_GET_ERROR',
        publicMessage: 'There was a problem getting the user',
        service: 'user'
    },
    'USER_UPDATE_ERROR': {
        code: 'USER_UPDATE_ERROR',
        publicMessage: 'There was a problem updating the user',
        service: 'user'
    },
    'USER_DELETE_ERROR': {
        code: 'USER_DELETE_ERROR',
        publicMessage: 'There was a problem deleting the user',
        service: 'user'
    },
    'USER_ROLES_ERROR': {
        code: 'USER_ROLES_ERROR',
        publicMessage: 'There was a problem geting the user\'s roles',
        service: 'user'
    },
    'USER_ME_ERROR': {
        code: 'USER_ME_ERROR',
        publicMessage: 'There was a problem getting your user',
        service: 'user',
    },
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
    code: string = '00'
    status: number = 500
    serviceName: string = 'unidentified service'
    publicMessage: string = 'unidentified error'

    constructor(errorInfo: ServiceErrorInfo, message?: string) {
        super(message ?? errorInfo.publicMessage)
        this.name = 'Service Error'
        this.code = errorInfo.code
        this.status = errorInfo.status
        this.serviceName = errorInfo.service
        this.publicMessage = errorInfo.publicMessage
    }
}
