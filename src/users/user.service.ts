import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import * as bcrypt from 'bcryptjs';
import { UpdateTenantInfoDto } from './dto/update-tenant-info.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with Email ${userId} not found`);
    }

    // Verify the current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash and save the new password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  async updateTenantInfo(
    userId: number,
    updateTenantInfoDto: UpdateTenantInfoDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.tenantInfo) {
      user.tenantInfo = { tenantName: '', apiKey: '', dbName: '' };
    }

    // Update tenantInfo
    if (updateTenantInfoDto.tenantName !== undefined) {
      user.tenantInfo.tenantName = updateTenantInfoDto.tenantName;
    }
    if (updateTenantInfoDto.apiKey !== undefined) {
      user.tenantInfo.apiKey = updateTenantInfoDto.apiKey;
    }
    if (updateTenantInfoDto.dbName !== undefined) {
      user.tenantInfo.dbName = updateTenantInfoDto.dbName;
    }

    await this.userRepository.save(user);
    return user;
  }
}
