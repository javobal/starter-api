import { sendEmail } from '../lib/mailgun'
import * as userRepository from '../repositories/user.repository'
import { getAuth } from 'firebase-admin/auth'
import { ServiceError, ServiceErrorInfo, UserServiceErrors } from '../types/errors'
import { Me, roles } from '../types/user'
import { getEnforcer } from '../lib/casbin'
import chalk from 'chalk'

function serviceErrorHandler(
    error: unknown,
    info: ServiceErrorInfo,
    methodName?: string
) : never {
    const errorMessage = error instanceof Error ? error.message : undefined
    console.error(
        chalk.bold.red(`APP ERROR [user.service${methodName ? '.' + methodName : ''}]`),
        errorMessage
    )

    if (error instanceof ServiceError) {
        throw error
    } else {
        throw new ServiceError(info, errorMessage)
    }
}

export const list = async (limit?: number, page?: number, cursor?: string) => {
    try {
        const users = await userRepository.list(limit, page, cursor)
        return users
    } catch (error) {
        serviceErrorHandler(error, UserServiceErrors.USER_LIST_ERROR, 'list')
    }
}

export const check = async (uid: string) => {
    try {
        // verify if the users already exists
        // just a test
        const user = await userRepository.getById(uid)

        if (user) {
            // user already exists
            return user.id
        } else {
            // user does not exists, create a new one
            const firebaseUser = await getAuth().getUser(uid)
            const newUser = await userRepository.createOrUpdate({
                id: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
            })

            // Send the welcome email
            if (newUser.email) {
                await sendEmail(
                    newUser.email,
                    'Welcome to Javobal',
                    `Welcome to Javobal, ${newUser.name}!`
                )
            }

            return newUser.id
        }
    } catch (error) {
        serviceErrorHandler(error, UserServiceErrors.CHECK_ERROR, 'check')
    }
}

export const deleteById = async (uid: string) => {
    try {
        const user = await userRepository.getById(uid)
        if (user) {
            await userRepository.deleteById(uid)
        } else {
            throw new ServiceError(UserServiceErrors.USER_NOT_FOUND)
        }
    } catch (error) {
        serviceErrorHandler(error, UserServiceErrors.USER_DELETE_ERROR, 'deleteById')
    }
}

export const update = async (uid: string, user: any) => {
    try {
        const _user = await userRepository.getById(uid)
        if (_user) {
            await userRepository.update(uid, user)
        }
    } catch (error) {
        serviceErrorHandler(error, UserServiceErrors.USER_UPDATE_ERROR, 'update')
    }
}

export const getRoles = async (uid: string) => {
    try {
        const roles = await getEnforcer().getRolesForUser(uid)
        return roles
    } catch (error) {
        serviceErrorHandler(error, UserServiceErrors.USER_ROLES_ERROR, 'getRoles')
    }
}

export const me = async (uid: string): Promise<Me> => {
    try {
        const user = await userRepository.getById(uid)

        if (user) {
            return {
                user,
                roles: (await getEnforcer().getRolesForUser(uid)) as unknown as roles[],
            }
        } else {
            throw new ServiceError(UserServiceErrors.USER_NOT_FOUND)
        }
    } catch (error) {
        serviceErrorHandler(error, UserServiceErrors.USER_ME_ERROR, 'me')
    }
}
