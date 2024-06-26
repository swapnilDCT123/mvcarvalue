import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  Session,
  // UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
// import { SerializerInterceptor } from 'src/interceptor/serilize.interceptor';
import { Serialize } from 'src/interceptor/serilize.interceptor';
import { UserDto } from './dtos/user-det';
import { AuthService } from './auth.service';
import { CurrentUser } from './decoraters/current-user-decorater';
import { User } from './user.entity';
// import { CurrentUserInterceptor } from './interceptor/current.user.interceptor';
import { AuthGaurd } from 'src/gaurds/auth.gaurd';
@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    console.log(body);
    // return this.userService.create(body.email, body.password);
    const user = await this.authService.signup(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  @Get('color/:color')
  async setColor(@Param('color') color: string, @Session() session: any) {
    return (session.color = color);
  }

  @Get('color')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Post('/signin')
  async signInUser(@Body() body: CreateUserDto, @Session() session: any) {
    console.log(body);
    // return this.userService.create(body.email, body.password);
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGaurd)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
  // @UseInterceptors(SerializerInterceptor)

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }
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
