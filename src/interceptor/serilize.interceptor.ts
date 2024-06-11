import {
  // UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user-det';

export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run Something befor a request is hadnles
    // by the request handler
    // console.log('I am running befor the handler ', context);

    return handler.handle().pipe(
      map((data: any) => {
        // run so   mething be
        // console.log('I am running responce is sent out', data)
        return plainToClass(UserDto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}