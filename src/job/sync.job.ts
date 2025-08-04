import { Job, IJob } from '@midwayjs/cron';
import { FORMAT } from '@midwayjs/core';

@Job({
  cronTime: FORMAT.CRONTAB.EVERY_MINUTE, // 每 分钟执行一次
  start: true, // 自动启动
})
export class DataSyncJob implements IJob {
  async onTick() {
    console.log('定时任务触发');
  }

  async onComplete() {
    console.log('任务完成');
  }
}