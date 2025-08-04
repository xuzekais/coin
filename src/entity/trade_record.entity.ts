import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('t_trade_record')
export class TradeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '投资组合ID' })
  @Index() // 添加索引以提高查询性能
  portfolioId: string;

  @Column({ comment: '交易对符号，如BTCUSDT' })
  symbol: string;

  @Column({ comment: '基础资产，如BTC' })
  baseAsset: string;

  @Column({ comment: '计价资产，如USDT' })
  quoteAsset: string;

  @Column({ comment: '交易方向，BUY表示买入，SELL表示卖出' })
  side: string;

  @Column({ comment: '订单类型，如LIMIT(限价单)、MARKET(市价单)' })
  type: string;

  @Column({ comment: '持仓方向，如BOTH、LONG、SHORT' })
  positionSide: string;

  @Column({ comment: '执行数量', type: 'decimal', precision: 20, scale: 8 })
  executedQty: number;

  @Column({ comment: '平均价格', type: 'decimal', precision: 20, scale: 8 })
  avgPrice: number;

  @Column({ comment: '总收益', type: 'decimal', precision: 20, scale: 8, default: 0 })
  totalPnl: number;

  @Column({ comment: '订单更新时间', type: 'bigint' })
  @Index() // 添加索引以便按时间排序查询
  orderUpdateTime: number;

  @Column({ comment: '订单创建时间', type: 'bigint' })
  orderTime: number;

  @CreateDateColumn({ comment: '记录创建时间' })
  createTime: Date;
}
