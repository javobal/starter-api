import * as admin from 'firebase-admin'

export const list = async () => {
    const users = await admin.firestore().collection('users').get()
    console.log(`users list -> found users ${users.docs.length}`)
    return users.docs.map(u => u.data())
}