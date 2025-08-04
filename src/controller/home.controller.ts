import { Controller, Get, Inject } from '@midwayjs/core';
import { Context } from 'egg';

@Controller('/')
export class HomeController {

    @Inject()
    ctx: Context;

    @Get('/')
    async home(): Promise<string> {
        return this.ctx.render('index.html');
    }
}
