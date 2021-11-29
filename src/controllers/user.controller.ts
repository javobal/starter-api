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
} from 'tsoa'
import { User } from '../model/user'
import * as userService from '../services/user.service'

interface ValidateErrorJSON {
    message: 'Validation failed'
    details: { [name: string]: unknown }
}

@Route('users')
@Tags('Users')
export class UserController extends Controller {
    @Get('/')
    public async list(): Promise<Array<User>> {
        return users.list()
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
    @Post('/')
    public async createOrUpdate(
        @Body() userData: User
    ): Promise<string | null> {
        this.setStatus(201)
        return userService.signup(userData)
    }
}
