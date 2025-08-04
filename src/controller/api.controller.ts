import { Inject, Controller, Get, Query, Config } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { MyScheduleService } from '@app/service/mySchedule.service';

@Controller('/api')
export class APIController {
    @Inject()
    ctx: Context;

    @Inject()
    userService: UserService;

    @Inject()
    myScheduleService: MyScheduleService;

    @Config('webKey')
    webKey: string;

    @Config('randomLocationList')
    randomLocationList: Record<string, any>;

    @Get('/get_user')
    async getUser(@Query('uid') uid) {
        const user = await this.userService.getUser({ uid });
        return { success: true, message: 'OK', data: user };
    }

    @Get('/useSchedule')
    async useSchedule() {
        const res = await this.myScheduleService.useSchedule();
        return { success: true, message: 'OK', data: res };
    }
}
