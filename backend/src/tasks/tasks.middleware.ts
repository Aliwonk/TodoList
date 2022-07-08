import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class TasksMiddleware implements NestMiddleware {

  // CHECK AUTH USER

  async use(req: Request, res: Response, next: () => void) {
    
      // get token

      const token = req.headers.authorization;

      // сhecking for token presence

      if(!token) {
        
        // send error UNAUTHORIZED

        return res
        .writeHead(
            HttpStatus.UNAUTHORIZED,
            {'Content-Type': 'application/json'}
        ).end(JSON.stringify({ error: 'Неавторизован' }));
      
      }else {

        next();
        
      }
  }
}
