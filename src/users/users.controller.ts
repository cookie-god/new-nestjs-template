import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersController) {}
}
