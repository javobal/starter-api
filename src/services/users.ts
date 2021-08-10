import * as users from '../model/users'

export const list = async () => {
    return users.list()
}