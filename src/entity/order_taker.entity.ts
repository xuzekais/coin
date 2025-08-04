import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_order_taker')
export class OrderTaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '投资组合ID' })
  portfolioId: string;

  @Column({ comment: '昵称' })
  nickname: string;

  @Column({ comment: '当前跟单数量', default: 0 })
  currentCopyCount: number;

  @Column({ comment: '最大跟单数量', default: 0 })
  maxCopyCount: number;

  @Column({ comment: '投资回报率', type: 'decimal', precision: 10, scale: 2, default: 0 })
  roi: number;

  @Column({ comment: '盈亏', type: 'decimal', precision: 10, scale: 2, default: 0 })
  pnl: number;

  @Column({ comment: '资产管理规模', type: 'decimal', precision: 10, scale: 2, default: 0 })
  aum: number;

  @Column({ comment: '最大回撤', type: 'decimal', precision: 10, scale: 2, default: 0 })
  mdd: number;

  @Column({ comment: '胜率', type: 'decimal', precision: 5, scale: 2, default: 0 })
  winRate: number;

  @Column({ comment: 'API密钥标签', nullable: true })
  apiKeyTag: string;

  @Column({ comment: '夏普比率', type: 'decimal', precision: 10, scale: 2, default: 0 })
  sharpRatio: number;

  @Column({ comment: '图表数据', type: 'json', nullable: true })
  chartItems: string;

  @Column({ comment: '徽章名称', nullable: true })
  badgeName: string;

  @Column({ comment: '徽章修改时间', type: 'timestamp', nullable: true })
  badgeModifyTime: Date;

  @Column({ comment: '徽章复制者数量', default: 0 })
  badgeCopierCount: number;

  @Column({ comment: '投资组合类型' })
  portfolioType: string;

  @Column({ comment: '创建时间', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ comment: '更新时间', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updateTime: Date;
}
