import { Provide } from '@midwayjs/decorator';
import axios from 'axios';
import { Base64 } from 'js-base64';
import { RedisService } from '@midwayjs/redis';
import { Inject } from '@midwayjs/core';

@Provide()
export class UpdateProxyPoolService {

  @Inject()
  redis: RedisService;

  // 订阅链接
  private readonly SUB_URL = 'https://45.137.181.46/link/dk4aPDuPkSqMRyWJ?sub=1';

  async updateProxyPool() {
    try {
        console.log('[updateProxyPool] 开始更新代理池...');
        // 1. 拉取订阅
        const { data } = await axios.get(this.SUB_URL, { timeout: 15000 });

        // 2. base64 → 文本
        const txt = Base64.decode(data);
        console.log(`[updateProxyPool] 拉取订阅成功，长度: ${txt.length}`);
        // 3. 文本 → 节点列表（按行分割，去掉空行）
        const nodeList = txt.split(/\r?\n/)
                          .map(s => s.trim())
                          .filter(Boolean);
        console.log('[nodeList] 节点列表:', nodeList);

        // 4. 清空旧池，写入新池
        await this.redis.del('proxy_pool');
        if (nodeList.length) {
            await this.redis.sadd('proxy_pool', ...nodeList);
        }
        console.log(`[updateProxyPool] 已更新 ${nodeList.length} 个节点`);
    } catch (e) {
        console.error('[updateProxyPool] 失败:', e.message);
    }
  }
}