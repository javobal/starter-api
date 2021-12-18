
import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth'

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Unauthorized request' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token || token === 'null') {
        return res.status(401).send({ message: 'Unauthorized request' });
    }

    const decodedToken = await getAuth().verifyIdToken(token)

    if (!decodedToken) { 
        return res.status(401).send({ message: 'Unauthorized request' });
    } else {
        req.token = decodedToken;
        next();
    }
}

export default authMiddleware;