import { Controller, Get, Post, Put, Del, Inject, Param, Body } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';

@Controller('/api/users')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  ctx: Context;

  @Get('/')
  async getUsers(): Promise<{
    success: boolean;
    data: User[];
    message: string;
  }> {
    const users = await this.userService.findAll();
    return { success: true, data: users, message: '获取用户列表成功' };
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<{
    success: boolean;
    data: User;
    message: string;
  }> {
    const user = await this.userService.findById(parseInt(id));
    return { success: true, data: user, message: '获取用户详情成功' };
  }

  @Post('/')
  async createUser(@Body() user: Partial<User>): Promise<{
    success: boolean;
    data: User;
    message: string;
  }> {
    const createdUser = await this.userService.create(user);
    return { 
      success: true, 
      data: createdUser, 
      message: '创建用户成功' 
    };
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: Partial<User>
  ): Promise<{
    success: boolean;
    data: User;
    message: string;
  }> {
    const updatedUser = await this.userService.update(parseInt(id), user);
    return { 
      success: true, 
      data: updatedUser, 
      message: '更新用户成功' 
    };
  }

  @Del('/:id')
  async deleteUser(@Param('id') id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const result = await this.userService.delete(parseInt(id));
    return { 
      success: result, 
      message: result ? '删除用户成功' : '删除用户失败' 
    };
  }
}
