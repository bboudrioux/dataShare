import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let message = "Une erreur est survenue lors de l'upload";
    let status = HttpStatus.BAD_REQUEST;

    if (exception.code === 'LIMIT_FILE_SIZE') {
      message = 'Le fichier est trop volumineux. La limite est de 1 Go.';
      status = HttpStatus.PAYLOAD_TOO_LARGE;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: 'Payload Too Large',
    });
  }
}
