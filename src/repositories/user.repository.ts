import * as admin from 'firebase-admin'
import { User } from '../model/user'

export const list = async () => {
    const users = await admin.firestore().collection('users').get()
    return users.docs.map(u => u.data() as User)
}

export const getById = async (id: string) => {
    const user = await admin.firestore().collection('users').doc(id).get()
    return user.exists ? user.data() as User : null
}

export const createOrUpdate = async (userData: User) => {
    const user = await admin.firestore().collection('users').add(userData)
    return user.id
}