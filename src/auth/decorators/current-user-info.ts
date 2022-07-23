import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUserInfo = createParamDecorator(
  (data: string | never, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const info = {
      agent: request.headers["user-agent"],
      ip: request.socket.remoteAddress
    }
    if(!data) return info
    return info[data]
  }
)