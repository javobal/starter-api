import { Request, Response, NextFunction } from 'express'
import { getAuth } from 'firebase-admin/auth'
import { getEnforcer } from '../lib/casbin'
import { AuthError } from '../types/networkErrors'

export async function expressAuthentication(
    req: Request,
    securityName: string,
    scopes?: string[]
) {
    try {
        if (!req.headers.authorization) {
            throw new AuthError('no access token provided', 401)
        }
        const token = req.headers.authorization.split(' ')[1]
        if (!token || token === 'null') {
            throw new AuthError('unauthorized request', 401)
        }

        const decodedToken = await getAuth().verifyIdToken(token)

        if (scopes) {
            const [obj, act] = scopes[0].split(':')

            const allowed = await getEnforcer().enforce(decodedToken.uid, obj, act)
            if (!allowed) {
                throw new AuthError(
                    `forbidded action ${act} on ${obj} for user uid: ${decodedToken.uid} `,
                    403
                )
            }
        }

        return decodedToken
    } catch (error) {
        console.error('expressAuthentication Error:', error)
        throw new AuthError('unauthorized request', 401)
    }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized request' })
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token || token === 'null') {
        return res.status(401).send({ message: 'unauthorized request' })
    }

    const decodedToken = await getAuth().verifyIdToken(token)

    if (!decodedToken) {
        return res.status(401).send({ message: 'unauthorized request' })
    } else {
        req.token = decodedToken
        next()
    }
}

export default authMiddleware
