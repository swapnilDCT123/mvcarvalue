import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  // UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
// import { SerializerInterceptor } from 'src/interceptor/serilize.interceptor';
import { Serialize } from 'src/interceptor/serilize.interceptor';
import { UserDto } from './dtos/user-det';
@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Serialize(UserDto)
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    console.log(body);
    return this.userService.create(body.email, body.password);
  }

  // @UseInterceptors(SerializerInterceptor)
  @Serialize(UserDto)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  findAllUser(@Query('email') email: string) {
    // const users = await this.userService.find(email);
    // return users.map((user) => plainToClass(User, users));
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
