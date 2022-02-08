import { Request, Response, NextFunction } from 'express'
import { getAuth } from 'firebase-admin/auth'
import { getEnforcer } from '../lib/casbin'

export class AuthError extends Error {
    status: number = 401
    constructor(message: string, status: number) {
        super(message)
        this.name = 'Error'
        this.status = status
    }
}

export async function expressAuthentication(
    req: Request,
    securityName: string,
    scopes?: string[]
) {
    if (!req.headers.authorization) {
        throw new AuthError('no access token provided', 401)
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token || token === 'null') {
        throw new AuthError('unauthorized request', 401)
    }

    const decodedToken = await getAuth().verifyIdToken(token)

    if (decodedToken) {
        if (scopes) {

            const obj = req.path.split('/')[1]

            const allowed = await getEnforcer().enforce(
                decodedToken.uid,
                obj,
                scopes[0]
            )
            if (!allowed) throw new AuthError(`action "${scopes[0]}" on ${obj} forbidded for user: ${decodedToken.uid} `, 403)
        }

        return decodedToken
    } else {
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
