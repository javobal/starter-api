import * as admin from 'firebase-admin'
import { User } from '../model/user'

export const list = async (
    limit: number = 10,
    page: number = 0,
    cursor: string | undefined = undefined
) => {
    let cursorSnapshot
    if (cursor) {
        cursorSnapshot = await admin
            .firestore()
            .collection('users')
            .doc(cursor || '0')
            .get()
    }

    const allUsers = await admin.firestore().collection('users').get()

    const users = await admin
        .firestore()
        .collection('users')
        .limit(limit)
        //.startAfter(cursorSnapshot || null)
        .offset(limit * page)
        .get()
    return {
        count: allUsers.size,
        users: users.docs.map((u) => ({ ...u.data(), id: u.id } as User)),
    }
}

export const getById = async (id: string) => {
    const user = await admin.firestore().collection('users').doc(id).get()
    return user.exists ? (user.data() as User) : null
}

export const createOrUpdate = async (userData: User) => {
    if (!userData.id) throw new Error('user id is required')
    const doc = await admin.firestore().collection('users').doc(userData.id)
    await doc.create(userData)

    const user = await doc.get()

    return { ...user.data(), id: user.id } as User 
}

export const update = async (id: string, userData: User) => {
    if (!id) throw new Error('user id is required')
    const doc = await admin.firestore().collection('users').doc(id)
    await doc.update(userData)

    const user = await doc.get()

    return { ...user.data(), id: user.id } as User 
}

export const deleteById = async (id: string) => {
    const doc = await admin.firestore().collection('users').doc(id)
    await doc.delete()
}