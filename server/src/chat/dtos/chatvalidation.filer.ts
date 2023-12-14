import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    //check if exception is from ValidationClass
    if (true){
      console.log("exception type ****: ", exception)

    }
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();
    const errors = exception.getResponse();
    client.emit('Error', { errors });
  }
}