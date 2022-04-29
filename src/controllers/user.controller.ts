import * as users from '../repositories/user.repository'
import {
    Get,
    Route,
    Tags,
    Post,
    Body,
    Path,
    Controller,
    Response,
    SuccessResponse,
    Query,
    Middlewares,
    Request,
    Delete,
    Security,
    TsoaResponse,
    Res,
    HttpStatusCodeLiteral,
} from 'tsoa'
import { User } from '../model/user'
import * as userService from '../services/user.service'
import authMiddleware from './authMiddleware'
import { Request as ExpressRequest } from 'express'
import { Me } from '../types/user'
import { ServiceError } from '../types/errors'

interface ValidateErrorJSON {
    message: 'Validation failed'
    details: { [name: string]: unknown }
}

interface TableResponse<T> {
    count: number,
    list: T[]
}

interface ResponseError {
    message: string,
    code: string
}


@Route('users')
@Tags('Users')
export class UserController extends Controller {
    /**
   * @param responseError Standard API error response
   */
    @Get('/')
    @Security('access_token', ['users:read'])
    public async list(
        @Res() responseError: TsoaResponse<500 | 404, ResponseError>,
        @Query() limit?: number,
        @Query() page?: number,
        @Query() cursor?: string
    ): Promise<TableResponse<User>> {
        try {
            const usersList = await userService.list(limit, page, cursor)
            return usersList //TODO: TableResponse formating separated from service list shape
        } catch (error) {
            if (error instanceof ServiceError) {
                return responseError(error.status as unknown as 500 | 404, { message: error.publicMessage, code: error.code });
            }
            return responseError(500, { message: 'unknown error', code: '00' });
        }
    }

    @Get('/me')
    @Security('access_token', ['users:read'])
    public async me(@Request() req: ExpressRequest): Promise<Me> {
        return userService.me(req.user!.uid)
    }

    /**
     * Retrieves the details of an existing user.
     * Supply the unique user ID from either and receive corresponding user details.
     * @param id The user's identifier
     */
    @Get('/:id')
    @Security('access_token', ['users:read'])
    public async getById(@Path() id: string): Promise<User | null> {
        return users.getById(id)
    }

    @Get('/:id/roles')
    @Security('access_token', ['users:read'])
    public async roles(@Path() id: string): Promise<string[] | null> {
        return userService.getRoles(id)
    }

    @Response<ValidateErrorJSON>(422, 'Validation Failed')
    @SuccessResponse(201, 'Created')
    @Middlewares(authMiddleware)
    @Post('/')
    public async createOrUpdate(@Request() req: ExpressRequest): Promise<string> {
        this.setStatus(201)
        const userId = await userService.check(req.token!.uid)
        return userId ?? ''
    }

    @Delete('/:id')
    @Security('access_token', ['users:write'])
    @SuccessResponse(200, 'Deleted')
    public async delete(
        @Request() req: ExpressRequest,
        @Path() id: string
    ): Promise<void> {
        this.setStatus(200)
        return userService.deleteById(id)
    }

    @Post('/:id')
    @Security('access_token', ['users:write'])
    public async update(@Body() requestBody: User, @Path() id: string): Promise<void> {
        return userService.update(id, requestBody)
    }
}
