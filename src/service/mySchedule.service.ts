import { Provide } from '@midwayjs/core';
import axios, { AxiosError } from 'axios';
import dayjs = require('dayjs');
import { HttpsProxyAgent } from 'https-proxy-agent';
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

const mockData = {
  "code": "000000",
  "message": null,
  "messageDetail": null,
  "data": {
    "indexValue": "1753709629702",
    "total": 183,
    "list": [
      {
        "symbol": "BNBUSDT",
        "baseAsset": "BNB",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "LIMIT",
        "positionSide": "BOTH",
        "executedQty": 300,
        "avgPrice": 819,
        "totalPnl": 0,
        "orderUpdateTime": 1753755573405,
        "orderTime": 1753647077503
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 118020.1,
        "totalPnl": 0,
        "orderUpdateTime": 1753713128638,
        "orderTime": 1753713128638
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 118018.6,
        "totalPnl": 0,
        "orderUpdateTime": 1753713114149,
        "orderTime": 1753713114149
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 117995.4,
        "totalPnl": 0,
        "orderUpdateTime": 1753713096260,
        "orderTime": 1753713096260
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 118571.5631,
        "totalPnl": 0,
        "orderUpdateTime": 1753710434921,
        "orderTime": 1753710434921
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 118653.6,
        "totalPnl": 0,
        "orderUpdateTime": 1753710301603,
        "orderTime": 1753710301602
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "LIMIT",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 119044,
        "totalPnl": 473.01250017,
        "orderUpdateTime": 1753710111938,
        "orderTime": 1753708361098
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "LIMIT",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 118966,
        "totalPnl": 239.01250012,
        "orderUpdateTime": 1753710104478,
        "orderTime": 1753710059408
      },
      {
        "symbol": "BTCUSDT",
        "baseAsset": "BTC",
        "quoteAsset": "USDT",
        "side": "SELL",
        "type": "LIMIT",
        "positionSide": "BOTH",
        "executedQty": 3,
        "avgPrice": 118888,
        "totalPnl": 5.01250018,
        "orderUpdateTime": 1753710075213,
        "orderTime": 1753710042939
      },
      {
        "symbol": "BNBUSDT",
        "baseAsset": "BNB",
        "quoteAsset": "USDT",
        "side": "BUY",
        "type": "MARKET",
        "positionSide": "BOTH",
        "executedQty": 60,
        "avgPrice": 842.76012,
        "totalPnl": 0,
        "orderUpdateTime": 1753709629702,
        "orderTime": 1753709629702
      }
    ]
  },
  "success": true
}
@Provide()
export class MyScheduleService {
    async useSchedule() {
        await this.fetchBinanceData()
        // 1、设置一个定时任务

        
        // 2、定时任务执行时，调用某个方法
        // 3、方法执行时，返回一个结果
        // 4、将结果返回给调用者
        return 
    }

    // 调用币安的API获取数据
    async fetchBinanceData(mock = true) {
        

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`尝试第 ${attempt} 次连接币安API...`);
                const reqTimestamp = this.getReqTimestamp();
                console.log('请求时间戳:', reqTimestamp);
                const reqData = {
                    portfolioId: '4286585043378852352',
                    ...reqTimestamp, // 使用处理后的时间戳
                    pageSize: 10, 
                }
                let res = null
                if (mock) {
                    res = mockData
                }else {
                    res = await axiosInstance.post('https://www.binance.com/bapi/futures/v1/friendly/future/copy-trade/lead-portfolio/order-history', {
                        ...reqData
                    },{
                        httpsAgent: agent,
                    });
                }
                // 处理交易操作记录
                
                console.log('Binance data:', res.data);
                console.log('Binance data:', res.data.data);
                console.log('Binance data:', res.data.data.list);
                return { success: true, data: res.data };
                
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error(`第 ${attempt} 次尝试失败:`, {
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

    // 处理调用的时间戳
    getReqTimestamp() {
        const obj = {
            'startTime': dayjs().subtract(1, 'day').valueOf(), //前一天
            'endTime': dayjs().valueOf(), //当天
        }
        return obj;
    }

    // 格式化交易记录
    formatTradeRecord(data){
        // 跟数据库对比数据是否有更新
        // 无--不操作
        // 有--提醒，计算持仓，并落库
    }
}
