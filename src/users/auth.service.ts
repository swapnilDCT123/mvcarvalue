import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import * as bcrypt from 'bcrypt';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email in use

    const users: any = await this.userService.find(email);
    console.log(users);

    if (users.length > 0) {
      throw new BadRequestException('email in already registered ');
    }

    // const saltOrRounds = 10
    // const hash = await bcrypt.hash(password, saltOrRounds);
    // hash the user password

    // Generate a salt
    const salt = randomBytes(10).toString('hex');

    // Hash the salt and passwprd together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hased result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create a user and save it
    const user = await this.userService.create(email, result);

    // retuen the user

    return user;
  }

  // Sign in user

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    if (!user.password) {
      throw new BadRequestException('User does not have a password set');
    }

    const [salt, storedHash] = user.password.split('.');
    if (!salt || !storedHash) {
      throw new BadRequestException('Invalid password format');
    }

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }
}
