import type { MidwayConfig } from '@midwayjs/core';
import { join as pathJoin } from 'path';

export default {
    // use for cookie sign key, should change to your own and keep security
    keys: '1683801360256_4072',
    koa: {
        port: 7001,
    },

    webKey: 'HWOBZ-RICCV-3MOPO-UMRNO-WMY7Q-PPBK5',

    staticFile: {
        dirs: {
            default: {
                prefix: `/public/`,
                dir: pathJoin(__dirname, '../public'),
            },
        },
    },

    // 模板引擎配置
    view: {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.html': 'nunjucks',
        },
    },

    // MySQL数据库配置 - 使用typeorm而不是orm
    typeorm: {
        dataSource: {
            default: {
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'jv1234', // 替换为你的数据库密码
                database: 'db_binance', // 替换为你的数据库名称
                synchronize: true, // 开发环境下自动同步实体结构（生产环境建议关闭）
                logging: true,
                entities: ['**/entity/*.entity{.ts,.js}'], // 实体文件位置
            }
        }
    },

    // 企业微信配置
    wechatWork: {
        // 机器人webhook地址
        robotWebhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=dcce237d-30f4-47f0-b1e3-4a789aaf46af',
        // 企业ID，用于应用消息
        corpId: 'your-corp-id',
        // 应用的凭证密钥
        corpSecret: 'your-corp-secret',
        // 应用ID
        agentId: 1000001
    },

    redis: {
        client: {
        port: 6379, // Redis port
        host: "127.0.0.1", // Redis host
        password: "test11",
        db: 0,
        },
    },
} as MidwayConfig;
