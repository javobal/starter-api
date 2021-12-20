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
    Request
} from 'tsoa'
import { User } from '../model/user'
import * as userService from '../services/user.service'
import authMiddleware from './authMiddleware'
import { Request as ExpressRequest } from 'express'

interface ValidateErrorJSON {
    message: 'Validation failed'
    details: { [name: string]: unknown }
}

interface usersResponse {
    count: number
    users: User[]
}

@Route('users')
@Tags('Users')
export class UserController extends Controller {
    @Get('/')
    public async list(@Query() limit?: number , @Query() page?: number ,@Query() cursor?: string): Promise<usersResponse> {
        return users.list(limit, page, cursor)
    }

    /**
     * Retrieves the details of an existing user.
     * Supply the unique user ID from either and receive corresponding user details.
     * @param id The user's identifier
     */
    @Get('/:id')
    public async getById(@Path() id: string): Promise<User | null> {
        return users.getById(id)
    }

    @Response<ValidateErrorJSON>(422, 'Validation Failed')
    @SuccessResponse(201, 'Created')
    @Middlewares(authMiddleware)
    @Post('/')
    public async createOrUpdate(
        @Request() req: ExpressRequest
    ): Promise<string> {
        this.setStatus(201)
        const userId = await userService.check(req.token!.uid)
        return userId ?? ''
    }
}
