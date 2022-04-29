export interface ServiceErrorInfo {
    code: string
    status: number
    service: string
    publicMessage: string
}

export const UserServiceErrors: Record<string, ServiceErrorInfo> = {
    'UNIDENTIFIED_ERROR': {
        code: 'S00',
        status: 500,
        publicMessage: 'Unidentified error',
        service: 'user',
    },
    'USER_NOT_FOUND': {
        code: 'S01',
        status: 404,
        publicMessage: 'User not found',
        service: 'user',
    },
    'CHECK_ERROR': {
        code: 'S02',
        status: 500,
        publicMessage: 'There was a problem checking this user',
        service: 'user',
    },
    'USER_LIST_ERROR': {
        code: 'S03',
        status: 500,
        publicMessage: 'There was a problem listing users',
        service: 'user'
    },
    'USER_UPDATE_ERROR': {
        code: 'S04',
        status: 500,
        publicMessage: 'There was a problem updating the user',
        service: 'user'
    },
    'USER_DELETE_ERROR': {
        code: 'S05',
        status: 500,
        publicMessage: 'There was a problem deleting the user',
        service: 'user'
    },
    'USER_ROLES_ERROR': {
        code: 'S06',
        status: 500,
        publicMessage: 'There was a problem geting the user\'s roles',
        service: 'user'
    },
    'USER_ME_ERROR': {
        code: 'S07',
        status: 500,
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
