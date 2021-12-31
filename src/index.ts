import morgan from 'morgan'
import { RegisterRoutes } from './routes/routes'
import initFirebase from './lib/firebase'
import swaggerUi from 'swagger-ui-express'
import express, {
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from 'express'
import { ValidateError } from 'tsoa'
import cors from 'cors'
import { AuthError } from './controllers/authMiddleware'
initFirebase()

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(cors())

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

    console.error(`Error for ${req.path}:`, err)

    if (err instanceof ValidateError) {
        console.warn(`Validation Error for ${req.path}:`, err.fields)
        return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
        })
    }
    if (err instanceof AuthError) {
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    if (err instanceof Error) {

        return res.status(500).json({
            message: 'Internal Server Error',
        })
    }

    next()
})

app.listen(process.env.PORT, () => {
    console.log(`app listening at http://localhost:${process.env.PORT}`)
})
