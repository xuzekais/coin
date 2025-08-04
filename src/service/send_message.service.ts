import { Config, Provide } from '@midwayjs/core';
import axios from 'axios';
import * as crypto from 'crypto';

// 消息类型定义
export enum WechatMsgType {
  TEXT = 'text',
  MARKDOWN = 'markdown',
  IMAGE = 'image',
  NEWS = 'news',
  FILE = 'file'
}

// 消息接口定义
export interface WechatMessage {
  msgtype: WechatMsgType;
  [key: string]: any;
}

@Provide()
export class SendMessageService {
  @Config('wechatWork')
  wechatWorkConfig;

  /**
   * 发送企业微信群机器人消息
   * @param message 消息内容
   * @param webhookUrl 可选的webhook URL，如果不提供则使用配置中的默认URL
   */
  async sendRobotMessage(message: WechatMessage, webhookUrl?: string): Promise<{success: boolean; message: string; data?: any}> {
    try {
      // 使用提供的webhook或配置中的默认webhook
      const webhook = webhookUrl || this.wechatWorkConfig?.robotWebhook;
      
      if (!webhook) {
        return { success: false, message: '未提供有效的企业微信webhook URL' };
      }

      // 发送请求到企业微信API
      const response = await axios.post(webhook, message, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.errcode === 0) {
        return { success: true, message: '消息发送成功', data: response.data };
      } else {
        return { 
          success: false, 
          message: `消息发送失败: ${response.data.errmsg}`, 
          data: response.data 
        };
      }
    } catch (error) {
      console.error('发送企业微信消息失败:', error);
      return { 
        success: false, 
        message: `发送消息时发生错误: ${error.message}` 
      };
    }
  }

  /**
   * 发送文本消息
   * @param content 消息内容
   * @param mentionedList 提及的用户ID列表 (可选)
   * @param mentionedMobileList 提及的用户手机号列表 (可选)
   * @param webhookUrl 可选的webhook URL
   */
  async sendTextMessage(
    content: string, 
    mentionedList: string[] = [], 
    mentionedMobileList: string[] = [],
    webhookUrl?: string
  ): Promise<{success: boolean; message: string; data?: any}> {
    const message: WechatMessage = {
      msgtype: WechatMsgType.TEXT,
      text: {
        content,
        mentioned_list: mentionedList,
        mentioned_mobile_list: mentionedMobileList
      }
    };

    return this.sendRobotMessage(message, webhookUrl);
  }

  /**
   * 发送Markdown消息
   * @param content Markdown格式的消息内容
   * @param webhookUrl 可选的webhook URL
   */
  async sendMarkdownMessage(
    content: string,
    webhookUrl?: string
  ): Promise<{success: boolean; message: string; data?: any}> {
    const message: WechatMessage = {
      msgtype: WechatMsgType.MARKDOWN,
      markdown: {
        content
      }
    };

    return this.sendRobotMessage(message, webhookUrl);
  }

  /**
   * 发送图片消息
   * @param base64 图片的base64编码
   * @param md5 图片的MD5值
   * @param webhookUrl 可选的webhook URL
   */
  async sendImageMessage(
    base64: string,
    md5?: string,
    webhookUrl?: string
  ): Promise<{success: boolean; message: string; data?: any}> {
    // 如果未提供md5，则计算base64的md5
    const imageMd5 = md5 || crypto.createHash('md5').update(base64).digest('hex');
    
    const message: WechatMessage = {
      msgtype: WechatMsgType.IMAGE,
      image: {
        base64,
        md5: imageMd5
      }
    };

    return this.sendRobotMessage(message, webhookUrl);
  }

  /**
   * 发送应用消息到指定用户或部门
   * 注意：此功能需要企业微信应用的access_token
   * @param agentId 应用ID
   * @param messageContent 消息内容
   * @param toUser 接收消息的用户，多个用户用|分隔
   * @param toParty 接收消息的部门，多个部门用|分隔
   * @param toTag 接收消息的标签，多个标签用|分隔
   */
  async sendAppMessage(
    agentId: number,
    messageContent: WechatMessage,
    toUser: string = '@all',
    toParty?: string,
    toTag?: string
  ): Promise<{success: boolean; message: string; data?: any}> {
    try {
      // 获取企业微信API access_token (需要实现获取token的方法)
      const accessToken = await this.getAccessToken();
      
      if (!accessToken) {
        return { success: false, message: '获取access_token失败' };
      }

      const message = {
        touser: toUser,
        toparty: toParty,
        totag: toTag,
        agentid: agentId,
        ...messageContent,
        safe: 0,
        enable_id_trans: 0,
        enable_duplicate_check: 0
      };

      const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`;
      const response = await axios.post(url, message);

      if (response.data.errcode === 0) {
        return { success: true, message: '应用消息发送成功', data: response.data };
      } else {
        return { 
          success: false, 
          message: `应用消息发送失败: ${response.data.errmsg}`, 
          data: response.data 
        };
      }
    } catch (error) {
      console.error('发送企业微信应用消息失败:', error);
      return { 
        success: false, 
        message: `发送应用消息时发生错误: ${error.message}` 
      };
    }
  }

  /**
   * 获取企业微信API access_token
   * 这里需要实现获取和缓存token的逻辑
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      const corpId = this.wechatWorkConfig?.corpId;
      const corpSecret = this.wechatWorkConfig?.corpSecret;
      
      if (!corpId || !corpSecret) {
        console.error('企业微信配置缺失');
        return null;
      }

      // 这里可以添加token缓存逻辑，避免频繁请求
      
      const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${corpSecret}`;
      const response = await axios.get(url);

      if (response.data.errcode === 0) {
        return response.data.access_token;
      } else {
        console.error('获取access_token失败:', response.data);
        return null;
      }
    } catch (error) {
      console.error('获取access_token出错:', error);
      return null;
    }
  }
}
