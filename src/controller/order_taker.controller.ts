import { Controller, Get, Query, Param, Inject, Post, Body } from '@midwayjs/core';
import { OrderTakerService } from '../service/order_taker.service';
import { OrderTaker } from '../entity/order_taker.entity';

@Controller('/api/orderTaker')
export class OrderTakerController {
  @Inject()
  orderTakerService: OrderTakerService;

  /**
   * 获取所有订单接收者数据
   */
  @Get('/list')
  async getList(): Promise<{ success: boolean; data: OrderTaker[]; message: string }> {
    try {
        console.log('Fetching all order takers...');
      const data = await this.orderTakerService.findAll();
      return {
        success: true,
        data,
        message: '获取成功',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: `获取失败: ${error.message}`,
      };
    }
  }

  /**
   * 根据ID获取单个订单接收者
   */
  @Get('/detail/:id')
  async getDetail(@Param('id') id: number): Promise<{ success: boolean; data: OrderTaker; message: string }> {
    try {
      const data = await this.orderTakerService.findById(id);
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
   * 根据投资组合ID获取订单接收者
   */
  @Get('/portfolio/:portfolioId')
  async getByPortfolioId(@Param('portfolioId') portfolioId: string): Promise<{ success: boolean; data: OrderTaker; message: string }> {
    try {
      const data = await this.orderTakerService.findByPortfolioId(portfolioId);
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
   * 分页查询订单接收者
   */
  @Get('/page')
  async getByPage(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('portfolioType') portfolioType?: string,
    @Query('nickname') nickname?: string
  ): Promise<{ success: boolean; data: { list: OrderTaker[]; total: number }; message: string }> {
    try {
      // 构建查询条件
      const query: any = {};
      if (portfolioType) {
        query.portfolioType = portfolioType;
      }
      if (nickname) {
        query.nickname = nickname;
      }

      const data = await this.orderTakerService.findByPage(query, page, pageSize);
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
   * 批量新增/更新订单接收者数据
   * 支持增量更新：如果数据已存在（根据portfolioId判断），则更新；不存在则新增
   */
  @Post('/batchSave')
  async batchSave(@Body() orderTakers: OrderTaker[]): Promise<{ success: boolean; data: OrderTaker[]; message: string; count: number }> {
    try {
      console.log(`开始批量处理 ${orderTakers?.length || 0} 条数据`);
      
      if (!Array.isArray(orderTakers) || orderTakers.length === 0) {
        return {
          success: false,
          data: [],
          message: '数据格式错误或为空',
          count: 0,
        };
      }
      
      const savedData = await this.orderTakerService.batchSaveOrderTakers(orderTakers);
      
      return {
        success: true,
        data: savedData,
        message: '批量保存成功',
        count: savedData.length,
      };
    } catch (error) {
      console.error('批量保存失败:', error);
      return {
        success: false,
        data: [],
        message: `批量保存失败: ${error.message}`,
        count: 0,
      };
    }
  }
}
