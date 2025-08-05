import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as staticFile from '@midwayjs/static-file';
import * as view from '@midwayjs/view-nunjucks';
import 'tsconfig-paths/register';
import * as cron from '@midwayjs/cron';
import * as typeorm from '@midwayjs/typeorm'; // 使用新的typeorm模块
import * as redis from '@midwayjs/redis';
@Configuration({
  imports: [
    koa,
    validate,
    staticFile,
    view,
    cron,
    typeorm, // 使用新的typeorm模块
    redis,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
