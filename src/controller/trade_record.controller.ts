import { Controller, Get, Post, Query, Param, Body, Inject } from '@midwayjs/core';
import { TradeRecordService } from '../service/trade_record.service';
import { TradeRecord } from '../entity/trade_record.entity';

@Controller('/api/tradeRecord')
export class TradeRecordController {
  @Inject()
  tradeRecordService: TradeRecordService;

  /**
   * 获取特定投资组合ID的所有交易记录
   * @param portfolioId 投资组合ID
   * @param page 页码
   * @param pageSize 每页大小
   */
  @Get('/portfolio/:portfolioId')
  async getRecordsByPortfolioId(
    @Param('portfolioId') portfolioId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 50
  ): Promise<{ success: boolean; data: { list: TradeRecord[]; total: number }; message: string }> {
    try {
      const data = await this.tradeRecordService.getRecordsByPortfolioId(portfolioId, page, pageSize);
      return {
        success: true,
        data,
        message: '获取成功',
      };
    } catch (error) {
      return {
        success: false,
        data: { list: [], total: 0 },
        message: `获取失败: ${error.message}`,
      };
    }
  }

  /**
   * 获取特定投资组合ID的最新交易记录
   * @param portfolioId 投资组合ID
   */
  @Get('/portfolio/:portfolioId/latest')
  async getLatestRecord(
    @Param('portfolioId') portfolioId: string
  ): Promise<{ success: boolean; data: TradeRecord; message: string }> {
    try {
      const data = await this.tradeRecordService.getLatestRecordByPortfolioId(portfolioId);
      return {
        success: true,
        data,
        message: '获取成功',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `获取失败: ${error.message}`,
      };
    }
  }

  /**
   * 批量保存交易记录（支持增量更新）
   * @param records 交易记录数组
   */
  @Post('/batch')
  async batchSaveRecords(
    @Body() records: TradeRecord[]
  ): Promise<{ success: boolean; data: { savedCount: number }; message: string }> {
    try {
      if (!Array.isArray(records) || records.length === 0) {
        return {
          success: false,
          data: { savedCount: 0 },
          message: '数据格式错误或为空',
        };
      }
      
      const savedRecords = await this.tradeRecordService.batchSaveRecords(records);
      
      return {
        success: true,
        data: { savedCount: savedRecords.length },
        message: `成功保存 ${savedRecords.length} 条交易记录`,
      };
    } catch (error) {
      return {
        success: false,
        data: { savedCount: 0 },
        message: `批量保存失败: ${error.message}`,
      };
    }
  }
}
