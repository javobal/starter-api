import { User } from '../model/user'

export enum roles {
    ADMIN = 'admin',
    USER = 'user',
}

export interface Me {
    user: User
    roles: roles[]
}
