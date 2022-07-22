import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: string | never, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    // console.log(request.socket.remoteAddress); //TODO: Store IP in DB
    if (!data) return request.user
    return request.user[data]
  }
)