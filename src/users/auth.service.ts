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
    const users = await this.userService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('Email is already registered');
    }

    const salt = randomBytes(10).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;

    const user = await this.userService.create(email, result);
    return user;
  }

  // Sign in user

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    console.log(user);
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
