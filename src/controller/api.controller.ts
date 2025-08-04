import { Inject, Controller, Get, Config } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Controller('/api')
export class APIController {
    @Inject()
    ctx: Context;

    @Config('webKey')
    webKey: string;

    @Config('randomLocationList')
    randomLocationList: Record<string, any>;

    @Get('/syncOrderTaker')
    async getUser() {
        // const user = await this.userService.getUser({ uid });
        // return { success: true, message: 'OK', data: user };
    }
}
