import { Inject, Provide } from '@midwayjs/core';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import dayjs = require('dayjs');
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OrderTakerService } from './order_taker.service';
import { TradeRecordService } from './trade_record.service';
import { TradeRecord } from '../entity/trade_record.entity';
import { SendMessageService } from './send_message.service';
const maxRetries = 3;
const retryDelay = 2000; // 2秒
const agent = new HttpsProxyAgent('http://127.0.0.1:7890')
// 配置axios实例
const axiosInstance = axios.create({
    timeout: 30000, // 30秒超时
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
});

const mockData = [
      {
        "symbol": "ONDOUSDT",
        "baseAsset": "ONDO",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 3823,
        "avgPrice": 0.8743,
        "totalPnl": 101.6918,
        "orderUpdateTime": 1754179390364,
        "orderTime": 1754179390364
      },
      {
        "symbol": "SEIUSDT",
        "baseAsset": "SEI",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 10881,
        "avgPrice": 0.2704,
        "totalPnl": 26.1144,
        "orderUpdateTime": 1754179376436,
        "orderTime": 1754179376436
      },
      {
        "symbol": "ADAUSDT",
        "baseAsset": "ADA",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 4252,
        "avgPrice": 0.7,
        "totalPnl": 60.3784,
        "orderUpdateTime": 1754179320774,
        "orderTime": 1754179320774
      },
      {
        "symbol": "HBARUSDT",
        "baseAsset": "HBAR",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 16006,
        "avgPrice": 0.23138,
        "totalPnl": 57.58534,
        "orderUpdateTime": 1754179309829,
        "orderTime": 1754179309829
      },
      {
        "symbol": "XRPUSDT",
        "baseAsset": "XRP",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 1172.8,
        "avgPrice": 2.7855,
        "totalPnl": -23.9445322,
        "orderUpdateTime": 1754179298892,
        "orderTime": 1754179298892
      },
      {
        "symbol": "XRPUSDT",
        "baseAsset": "XRP",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 1148.4,
        "avgPrice": 2.7846,
        "totalPnl": -24.47992833,
        "orderUpdateTime": 1754179297531,
        "orderTime": 1754179297516
      },
      {
        "symbol": "DOGEUSDT",
        "baseAsset": "DOGE",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 21137,
        "avgPrice": 0.19203,
        "totalPnl": 8.24343,
        "orderUpdateTime": 1754179285218,
        "orderTime": 1754179285218
      },
      {
        "symbol": "ONDOUSDT",
        "baseAsset": "ONDO",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "LIMIT",
        "positionSide": "BOTH",
        "executedQty": 3823,
        "avgPrice": 0.8477,
        "totalPnl": 0,
        "orderUpdateTime": 1754160435287,
        "orderTime": 1754136183154
      },
      {
        "symbol": "ADAUSDT",
        "baseAsset": "ADA",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "LIMIT",
        "positionSide": "BOTH",
        "executedQty": 4252,
        "avgPrice": 0.6858,
        "totalPnl": 0,
        "orderUpdateTime": 1754160434664,
        "orderTime": 1754136147998
      },
      {
        "symbol": "XRPUSDT",
        "baseAsset": "XRP",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "LIMIT",
        "positionSide": "BOTH",
        "executedQty": 1172.8,
        "avgPrice": 2.7631,
        "totalPnl": 0,
        "orderUpdateTime": 1754159538257,
        "orderTime": 1754136136328
      }
    ]
@Provide()
export class APIService {
    @Inject()
    orderTakerService: OrderTakerService;
    
    @Inject()
    tradeRecordService: TradeRecordService;

    @Inject()
    sendMessageService: SendMessageService;

    /**
     * 通用API请求方法
     * @param url 请求地址
     * @param data 请求参数
     * @param mock 是否使用模拟数据
     * @param mockResponse 模拟数据（如果mock为true）
     * @param config axios请求配置
     * @returns 请求结果
     */
    async fetchApiData(url: string, data: any, mock = false, mockResponse = null, config: AxiosRequestConfig = {}) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`尝试第 ${attempt} 次连接API: ${url}...`);
                
                let res = null;
                if (mock) {
                    // 使用提供的模拟数据或默认模拟数据
                    res = mockResponse || mockData;
                    console.log('使用模拟数据');
                } else {
                    // 合并默认配置和传入配置
                    const requestConfig = {
                        httpsAgent: agent,
                        ...config
                    };
                    
                    // 发送实际请求
                    const response = await axiosInstance.post(url, data, requestConfig);
                    res = response.data?.data?.list
                    console.log(`成功获取API响应: ${url}`);
                }
                
                return res;
                
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error(`第 ${attempt} 次尝试失败:`, {
                    url,
                    message: axiosError.message,
                    code: axiosError.code,
                    status: axiosError.response?.status,
                    statusText: axiosError.response?.statusText
                });
                
                if (attempt === maxRetries) {
                    console.error('所有重试都失败了，返回错误信息');
                    return { 
                        success: false, 
                        error: '网络连接失败，请检查网络设置或稍后重试',
                        details: axiosError.message 
                    };
                }
                
                // 等待后重试
                await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
            }
        }
    }

    // 获取所有领单员的信息
    async fetchAllOrderTakers(mock = true) {
        // 准备请求参数
        const reqData = {
            pageNumber: 1,
            pageSize: 18,
            timeRange: "7D", //时间
            dataType: "PNL",
            favoriteOnly: false,
            hideFull: false,
            nickname: "",
            order: "DESC",
            userAsset: 0,
            portfolioType: "ALL"
        };
        
        // 使用通用API请求方法
        const url = 'https://www.binance.com/bapi/futures/v1/friendly/future/copy-trade/home-page/query-list';
        const result = await this.fetchApiData(url, reqData, false);
        
        if (result.success) {
            
            console.log('Binance data:', result.data);
            if (result.data.data) {
                console.log('Binance data:', result.data.data);
                console.log('Binance data:', result.data.data.list);
            }
        }
        
        return result;
    }

    // 获取单个领单员的交易操作记录
    async fetchOrderTakerTradeRecords(portfolioId: string, mock = true) {
        // 准备请求参数
        const reqTimestamp = this.getReqTimestamp();
        console.log('请求时间戳:', reqTimestamp);
        const reqData = {
            portfolioId,
            ...reqTimestamp, // 使用处理后的时间戳
            pageSize: 10, 
        };
        
        // 使用通用API请求方法
        const url = 'https://www.binance.com/bapi/futures/v1/friendly/future/copy-trade/lead-portfolio/order-history';
        const result = await this.fetchApiData(url, reqData, mock);
        
        if (result.success) {
            // 处理交易操作记录
            console.log('Binance data:', result.data);
            if (result.data.data) {
                console.log('Binance data:', result.data.data);
                console.log('Binance data:', result.data.data.list);
            }
        }
        
        return result;
    }

    // 处理调用的时间戳
    getReqTimestamp() {
        const obj = {
            'startTime': dayjs().subtract(1, 'day').valueOf(), //前一天
            'endTime': dayjs().valueOf(), //当天
        }
        return obj;
    }

    // 格式化交易记录
    async formatTradeRecord(data,resList){
        // 获取数据库中的最新交易记录
        const dbRecords = await this.tradeRecordService.getLatestRecordByPortfolioId(data.portfolioId);
        console.log('数据库中的最新交易记录:', dbRecords);

        // 对比接口返回的数据和数据库的数据,symbol, orderTime, orderUpdateTime这几个字段是否相同
        const compareFields = ['symbol', 'orderTime', 'orderUpdateTime'];
        const hasNewData = compareFields.some(field => dbRecords[field] != resList[0][field]);
        if (hasNewData) {
            console.log('检测到新数据，准备更新数据库');
            const saveResult = await this.processAndSaveTradeRecords(data.portfolioId, resList);
            console.log('保存结果:', saveResult);
            // 处理企业微信发送的消息
            // await this.sendMessageService.sendTextMessage('无新数据，无需更新')
            // TODO: 计算持仓，并落库
            // 这里可以添加逻辑来处理新数据，比如计算持仓等
            

        } else {
            const message = this.formatMessage(resList);
            await this.sendMessageService.sendMarkdownMessage(message);
            console.log('无新数据，无需更新',message);
        }
    }


    /**
     * 处理交易记录并保存到数据库
     * @param portfolioId 投资组合ID
     * @param records 交易记录数据
     */
    async processAndSaveTradeRecords(portfolioId: string, records: any[]): Promise<{ saved: number, total: number }> {
        if (!records || !Array.isArray(records) || records.length === 0) {
            return { saved: 0, total: 0 };
        }
        
        // 将API返回数据转换为实体格式
        const tradeRecords: TradeRecord[] = records.map(record => ({
            portfolioId,
            symbol: record.symbol,
            baseAsset: record.baseAsset,
            quoteAsset: record.quoteAsset,
            side: record.side,
            type: record.type,
            positionSide: record.positionSide,
            executedQty: record.executedQty,
            avgPrice: record.avgPrice,
            totalPnl: record.totalPnl || 0,
            orderUpdateTime: record.orderUpdateTime,
            orderTime: record.orderTime,
        } as TradeRecord));
        
        // 保存交易记录
        const savedRecords = await this.tradeRecordService.batchSaveRecords(tradeRecords);
        return { saved: savedRecords.length, total: records.length };
    }

    // 更新获取交易操作记录方法，添加数据保存功能
    async fetchTradeRecords(mock = true) {
        // 1、读取领单员列表
        const orderTakersList = await this.orderTakerService.findAll();
        console.log('领单员列表:', orderTakersList);
        
        const results = [];
        
        // 2、获取每个领单员的交易记录
        for (const orderTaker of orderTakersList) {
            console.log(`获取领单员 ${orderTaker.nickname} 的交易记录...`);
            const tradeRecords = await this.fetchOrderTakerTradeRecords(orderTaker.portfolioId, mock);
            await this.formatTradeRecord(orderTaker,tradeRecords);

        }
        
        return results;
    }

    //处理企业微信消息
    formatMessage(list) {
        let message = '';
        for(const item of list) {
            // 这里可以根据需要格式化消息内容
            console.log(`处理消息: ${item.symbol} - ${item.side} - ${item.avgPrice}`);

            message += `${this.formatTradeRecordMessage(item)}  |  以价格为：${item.avgPrice},操作${item.symbol},成交量为：${item.executedQty}\n`;
        }
        return message;
    }

    // 处理一下方向的类型
    formatTradeRecordMessage(item) {
        let message = '';
        if (item.positionSide === 'BOTH') {
            if (item.side === 'BUY') {
                message += `<font color="info">做多</font>`;
            }
            else if (item.side === 'SELL') {
                message += `<font color="warning">做空</font>`;
            }
        }else if (item.positionSide === 'LONG') {
            if (item.totalPnl !== 0) {
                message += `<font color="comment">平多</font>`;
            } else {
                message += `<font color="info">开多</font>`;
            }
        }else if (item.positionSide === 'SHORT') {
            if (item.totalPnl !== 0) {
                message += `<font color="comment">平空</font>`;
            } else {
                message += `<font color="warning">开空</font>`;
            }
        }
        
        return message;
    }
}