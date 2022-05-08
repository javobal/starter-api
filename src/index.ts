import morgan from 'morgan'
import { RegisterRoutes } from './routes/routes'
import initFirebase from './lib/firebase'
import { init as initCasbin } from './lib/casbin'
import swaggerUi from 'swagger-ui-express'
import express, {
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from 'express'
import { ValidateError } from 'tsoa'
import cors from 'cors'
import { ServiceError } from './types/serviceErrors'
import { AuthError } from './types/networkErrors'

// Initializations
initFirebase()
initCasbin()

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(cors())

app.get('/', (_req, res: ExResponse) => {
    res.send(`API Starter`)
})

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/swagger.json',
        },
    })
)

RegisterRoutes(app)

app.use(function notFoundHandler(_req, res: ExResponse) {
    res.status(404).send({
        message: 'Not Found',
    })
})

app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    console.error(`[Error Handler] path: ${req.path} Error:`, err)

    if (err instanceof ValidateError) {
        console.warn(`Validation Error for ${req.path}:`, err.fields)
        return res.status(422).json({
            message: 'validation failed',
            details: err?.fields,
        })
    }
    if (err instanceof AuthError) {
        return res.status(err.status).send({ message: err.message })
    }
    if (err instanceof ServiceError) {
        return res.status(500).send({
            message: err.publicMessage,
            code: err.code,
        })
    }

    console.error('[Error Handler] Unknown error occurred giving back 500')

    if (err instanceof Error) {
        return res.status(500).json({
            message: 'internal server error',
        })
    }

    next()
})

app.listen(process.env.PORT, () => {
    console.log(`app listening at http://localhost:${process.env.PORT}`)
})
