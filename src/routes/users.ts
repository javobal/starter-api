import {Router} from 'express'
import * as usersService from '../services/users'

export const usersRouter = Router()

usersRouter.use('/', async (req, res) => {
    try {
        const users = await usersService.list()
        res.status(200).json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
})