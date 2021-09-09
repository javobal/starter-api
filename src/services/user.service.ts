import { User } from '../model/user'
import * as userRepository from '../repositories/user.repository'

export const signup = async (user: User) => {
    try {
        // Create the user record
        const userId = await userRepository.createOrUpdate(user)

        return userId
    } catch (error) {
        console.error('user.service signup error: ', error)
        throw error
    }
}
