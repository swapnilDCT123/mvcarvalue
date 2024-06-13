// import { CurrentUser } from './current-user-decorater';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    console.log('context', context);
    const request = context.switchToHttp().getRequest();
    // console.log('🚀 ~  request.session.userId:', request.session.userId);
    return request.CurrentUser;
  },
);
