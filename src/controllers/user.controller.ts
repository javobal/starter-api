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
    Security
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
    @Security('access_token', ['read'])
    public async list(@Query() limit?: number , @Query() page?: number ,@Query() cursor?: string): Promise<usersResponse> {
        return users.list(limit, page, cursor)
    }

    /**
     * Retrieves the details of an existing user.
     * Supply the unique user ID from either and receive corresponding user details.
     * @param id The user's identifier
     */
    @Get('/:id')
    @Security('access_token', ['read'])
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

    @Delete('/:id')
    @Security('access_token', ['write'])
    @SuccessResponse(200, 'Deleted')
    public async delete(
        @Request() req: ExpressRequest,
        @Path() id: string
    ): Promise<void> {
        this.setStatus(200)
        return userService.deleteById(id)
    }

    @Post('/:id')
    @Security('access_token')
    public async update(
        @Body() requestBody: User,
        @Path() id: string
    ): Promise<void> {
        return userService.update(id, requestBody)
    }

}
