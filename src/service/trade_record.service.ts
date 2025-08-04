import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TradeRecord } from '../entity/trade_record.entity';

@Provide()
export class TradeRecordService {
  @InjectEntityModel(TradeRecord)
  tradeRecordModel: Repository<TradeRecord>;

  /**
   * 获取特定投资组合ID的所有交易记录
   * @param portfolioId 投资组合ID
   * @param page 页码
   * @param pageSize 每页大小
   */
  async getRecordsByPortfolioId(portfolioId: string, page = 1, pageSize = 50): Promise<{ list: TradeRecord[], total: number }> {
    const [list, total] = await this.tradeRecordModel.findAndCount({
      where: { portfolioId },
      order: { orderUpdateTime: 'DESC' }, // 按更新时间降序排列
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    return { list, total };
  }

  /**
   * 获取特定投资组合ID的最新交易记录
   * @param portfolioId 投资组合ID
   */
  async getLatestRecordByPortfolioId(portfolioId: string): Promise<TradeRecord> {
    return this.tradeRecordModel.findOne({
      where: { portfolioId },
      order: { orderUpdateTime: 'DESC' }, // 按更新时间降序排列
    });
  }

  /**
   * 批量保存交易记录，实现增量更新
   * @param records 交易记录数组
   */
  async batchSaveRecords(records: TradeRecord[]): Promise<TradeRecord[]> {
    if (!records || records.length === 0) {
      return [];
    }

    // 获取所有需要检查的唯一标识组合 (portfolioId + symbol + orderTime + orderUpdateTime)
    const checkKeys = records.map(record => 
      `${record.portfolioId}_${record.symbol}_${record.orderTime}_${record.orderUpdateTime}`
    );

    // 查询已存在的记录
    const existingRecords = await this.tradeRecordModel
      .createQueryBuilder('record')
      .where('CONCAT(record.portfolioId, "_", record.symbol, "_", record.orderTime, "_", record.orderUpdateTime) IN (:...keys)', {
        keys: checkKeys
      })
      .getMany();

    // 创建已存在记录的映射，用于快速查找
    const existingMap = new Map<string, TradeRecord>();
    existingRecords.forEach(record => {
      const key = `${record.portfolioId}_${record.symbol}_${record.orderTime}_${record.orderUpdateTime}`;
      existingMap.set(key, record);
    });

    // 筛选出新记录和需要更新的记录
    const recordsToSave = records.map(record => {
      const key = `${record.portfolioId}_${record.symbol}_${record.orderTime}_${record.orderUpdateTime}`;
      if (existingMap.has(key)) {
        // 如果记录已存在，保留ID并更新其他字段
        const existing = existingMap.get(key);
        return { ...record, id: existing.id };
      }
      return record; // 新记录
    });

    // 批量保存(新增或更新)
    return this.tradeRecordModel.save(recordsToSave);
  }
}
