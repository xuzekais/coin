import { Middleware } from '@midwayjs/core';
import { NextFunction } from '@midwayjs/koa';
import * as koa2proxy from 'koa2-proxy-middleware';
import devops from '../../devops.config';

@Middleware()
export class ReportMiddleware {
    resolve() {
        return async (ctx, next: NextFunction) => {
            /** 开头如果是/api那么走midway服务 否则全部代理  */
            if (ctx.request.path.indexOf('/api') === 0) {
                return await next();
            }

            /** 静态资源也直接跳过  */
            if (ctx.request.path.indexOf('/public') === 0) {
                console.log('跳过了代理！');
                return await next();
            }

            /** 如果是正式环境 那么直接代理到静态服务器  */
            if (ctx.app.env === 'production') {
                return
            }

            /** 如果前端的路由刷新 那么直接跳转到 /  */
            if ((ctx.request.path.indexOf('/login') === 0) || (ctx.request.path.indexOf('/add-sign') === 0)) {
                ctx.redirect('/');
                return
            }

            // return await next();

            /** 开发环境直接代理到本地vite服务  */
            const options = {
                targets: {
                    '/(.*)': {
                        changeOrigin: true,
                        target: `http://127.0.0.1:${devops.port}`,
                        // pathRewrite: {},
                    }
                }
            };
            console.log(ctx.request.URL.href, 'ctx.request.path')
            return await koa2proxy(options)(ctx, next);
        };
    }

    static getName(): string {
        return 'report';
    }
}
