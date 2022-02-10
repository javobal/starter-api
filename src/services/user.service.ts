import { sendEmail } from '../lib/mailgun'
import * as userRepository from '../repositories/user.repository'
import { getAuth } from 'firebase-admin/auth'
import { ServiceError, UserServiceErrors } from '../types/errors'
import { Me, roles } from '../types/user'
import { getEnforcer } from '../lib/casbin'

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
        console.error('user.service.check error: ', error)
        throw error
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
        console.error('user.service.deleteById error: ', error)
        throw error
    }
}

export const update = async (uid: string, user: any) => {
    try {
        const _user = await userRepository.getById(uid)
        if (_user) {
            await userRepository.update(uid, user)
        }
    } catch (error) {
        console.error('user.service.update error: ', error)
        throw error
    }
}

export const getRoles = async (uid: string) => {
    const roles = await getEnforcer().getRolesForUser(uid)
    return roles
}

export const me = async (uid: string) : Promise<Me> => { 
    const user = await userRepository.getById(uid)
    if (user) {
        return {
            user,
            roles: await getEnforcer().getRolesForUser(uid) as unknown as roles[]
        }
    } else {
        throw new ServiceError(UserServiceErrors.USER_NOT_FOUND)
    }
}