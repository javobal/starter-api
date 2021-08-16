import * as users from "../repositories/user.repository";
import { Get, Route, Tags, Post, Body, Path, Controller } from "tsoa";
import { User } from "../model/user";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  @Get("/")
  public async list(): Promise<Array<User>> {
    return users.list();
  }

  @Get("/:id")
  public async getById(@Path() id: string): Promise<User | null> {
    return users.getById(id);
  }
}
