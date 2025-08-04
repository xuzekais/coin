import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { SendMessageService, WechatMsgType } from '../service/send_message.service';

@Controller('/api/message')
export class MessageController {
  @Inject()
  sendMessageService: SendMessageService;

  /**
   * 发送文本消息到企业微信群
   */
  @Post('/wechat/text')
  async sendTextMessage(
    @Body() body: { content: string; mentionedList?: string[]; mentionedMobileList?: string[]; webhookUrl?: string }
  ) {
    const { content, mentionedList = [], mentionedMobileList = [], webhookUrl } = body;
    
    if (!content) {
      return { success: false, message: '消息内容不能为空' };
    }

    return await this.sendMessageService.sendTextMessage(
      content,
      mentionedList,
      mentionedMobileList,
      webhookUrl
    );
  }

  /**
   * 发送Markdown消息到企业微信群
   */
  @Post('/wechat/markdown')
  async sendMarkdownMessage(
    @Body() body: { content: string; webhookUrl?: string }
  ) {
    const { content, webhookUrl } = body;
    
    if (!content) {
      return { success: false, message: '消息内容不能为空' };
    }

    return await this.sendMessageService.sendMarkdownMessage(content, webhookUrl);
  }

  /**
   * 发送自定义消息到企业微信群
   */
  @Post('/wechat/custom')
  async sendCustomMessage(
    @Body() body: { msgtype: WechatMsgType; [key: string]: any; webhookUrl?: string }
  ) {
    const { webhookUrl, ...message } = body;
    
    if (!message.msgtype) {
      return { success: false, message: '消息类型不能为空' };
    }

    return await this.sendMessageService.sendRobotMessage(message, webhookUrl);
  }
}
