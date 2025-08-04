import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderTaker } from '../entity/order_taker.entity';

@Provide()
export class OrderTakerService {
  @InjectEntityModel(OrderTaker)
  orderTakerModel: Repository<OrderTaker>;

  /**
   * 获取所有订单接收者数据
   */
  async findAll(): Promise<OrderTaker[]> {
    return this.orderTakerModel.find();
  }

  /**
   * 根据ID获取单个订单接收者
   * @param id ID
   */
  async findById(id: number): Promise<OrderTaker> {
    return this.orderTakerModel.findOne({ where: { id } });
  }

  /**
   * 根据投资组合ID获取订单接收者
   * @param portfolioId 投资组合ID
   */
  async findByPortfolioId(portfolioId: string): Promise<OrderTaker> {
    return this.orderTakerModel.findOne({ where: { portfolioId } });
  }

  /**
   * 按照条件分页查询订单接收者
   * @param query 查询条件
   * @param page 页码
   * @param pageSize 每页大小
   */
  async findByPage(query: any, page = 1, pageSize = 10): Promise<{ list: OrderTaker[], total: number }> {
    const [list, total] = await this.orderTakerModel.findAndCount({
      where: query,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    return { list, total };
  }

  /**
   * 批量保存订单接收者数据（增量更新）
   * @param orderTakers 订单接收者数据数组
   * @returns 保存后的数据
   */
  async batchSaveOrderTakers(orderTakers: OrderTaker[]): Promise<OrderTaker[]> {
    // 如果没有数据，直接返回空数组
    if (!orderTakers || orderTakers.length === 0) {
      return [];
    }

    // 获取所有传入对象的portfolioId列表
    const portfolioIds = orderTakers.map(item => item.portfolioId).filter(id => id);
    
    // 查找数据库中已存在的记录
    const existingRecords = portfolioIds.length > 0 
      ? await this.orderTakerModel.find({ 
          where: { portfolioId: In(portfolioIds) } 
        })
      : [];
    
    // 创建portfolioId到现有记录的映射
    const existingMap = new Map<string, OrderTaker>();
    existingRecords.forEach(record => {
      if (record.portfolioId) {
        existingMap.set(record.portfolioId, record);
      }
    });
    
    // 合并现有记录和新记录
    const recordsToSave = orderTakers.map(item => {
      if (item.portfolioId && existingMap.has(item.portfolioId)) {
        // 如果记录已存在，合并新旧数据（保留ID）
        const existing = existingMap.get(item.portfolioId);
        return { ...existing, ...item, id: existing.id };
      } else {
        // 新记录直接添加
        return item;
      }
    });
    
    // 批量保存（TypeORM的save方法会自动处理插入或更新）
    return this.orderTakerModel.save(recordsToSave);
  }
}
