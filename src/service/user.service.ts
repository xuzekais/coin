import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/typeorm'; // 改用@midwayjs/typeorm
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Provide()
export class UserService {
  @InjectRepository(User)
  userModel: Repository<User>;

  /**
   * 获取所有用户列表
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  /**
   * 根据ID获取用户
   */
  async findById(id: number): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  /**
   * 创建新用户
   */
  async create(user: Partial<User>): Promise<User> {
    // 创建新的用户实体
    const newUser = this.userModel.create(user);
    // 保存到数据库
    return await this.userModel.save(newUser);
  }

  /**
   * 更新用户
   */
  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userModel.update(id, user);
    return this.findById(id);
  }

  /**
   * 删除用户
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.userModel.delete(id);
    return result.affected > 0;
  }
}
