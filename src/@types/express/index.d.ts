import { DecodedIdToken } from 'firebase-admin/auth'

export {}

declare global {
    namespace Express {
        interface Request {
            token?: DecodedIdToken
            user?: DecodedIdToken
        }
    }
}
