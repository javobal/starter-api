import { Request, Response, NextFunction } from 'express'
import { getAuth } from 'firebase-admin/auth'

export class AuthError extends Error {
    constructor(message: string, status: number) {
        super(message)
        this.name = 'Error'
    }
}

export async function expressAuthentication(req: Request,
    securityName: string,
    scopes?: string[]) {
    if (!req.headers.authorization) {
        throw new AuthError('no access token provided', 401)
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token || token === 'null') {
        throw new AuthError('Unauthorized request', 401)
    }

    const decodedToken = await getAuth().verifyIdToken(token)

    if (!decodedToken) {
        throw new AuthError('Unauthorized request', 401)
    } else {
        return decodedToken
    }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token || token === 'null') {
        return res.status(401).send({ message: 'Unauthorized request' })
    }

    const decodedToken = await getAuth().verifyIdToken(token)

    if (!decodedToken) {
        return res.status(401).send({ message: 'Unauthorized request' })
    } else {
        req.token = decodedToken
        next()
    }
}

export default authMiddleware
