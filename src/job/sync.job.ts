import { Job, IJob } from '@midwayjs/cron';
import { FORMAT ,Inject} from '@midwayjs/core';
import { APIService } from '@app/service/api.service';
import { UpdateProxyPoolService } from '@app/service/update_proxy_pool.service'; // 假设这是你更新代理的服务
@Job({
  cronTime: FORMAT.CRONTAB.EVERY_MINUTE, // 每 分钟执行一次
  start: true, // 自动启动
})
export class DataSyncJob implements IJob {
  @Inject()
  apiService: APIService; // 假设APIService是你用来处理API

  @Inject()
  updateProxyPoolService: UpdateProxyPoolService; // 假设这是你更新代理

  async onTick() {
    console.log('定时任务触发一分钟一次');
    this.apiService.fetchTradeRecords()

  }

  async onComplete() {
    console.log('任务完成');
  }
}