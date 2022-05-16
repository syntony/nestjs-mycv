import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDto } from "../users/dtos/user.dto";

// to avoid usage Serialize decorator with non-class param
interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled
    // by the request handler
    // console.log('Im running before the handler', context);

    return handler.handle().pipe(
      map((data: unknown) => {
        // Run something before the response is sent out
        // console.log('Im running before the response is sent out', data);

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      })
    );
  }
}
