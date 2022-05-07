import chalk from "chalk"
import { ServiceError, ServiceErrorInfo } from "../types/errors"


export default function serviceErrorHandler(
    error: unknown,
    info: ServiceErrorInfo,
    location?: string
) : never {
    const errorMessage = error instanceof Error ? error.message : undefined
    console.error(
        chalk.bold.red(`SERVICE ERROR ${ location ? `[${location}]` : ''}`),
        errorMessage
    )

    if (error instanceof ServiceError) {
        throw error
    } else {
        throw new ServiceError(info, errorMessage)
    }
}