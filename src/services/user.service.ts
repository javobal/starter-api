import { sendEmail } from '../lib/mailgun'
import * as userRepository from '../repositories/user.repository'
import { getAuth } from 'firebase-admin/auth'

export const check = async (uid: string) => {
    try {

        // verify if the users already exists
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
