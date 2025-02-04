import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../interfaces/api-response.interface';
import { buildResponse } from '../utils/api-response.util';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserPasswordDto } from './dto/update-user-password-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateTenantInfoDto } from './dto/update-tenant-info.dto';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User | null>> {
    const { email } = createUserDto;
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const response = await this.userService.create(createUserDto);
    return buildResponse(true, 'OK', response);
  }

  @Get()
  // @Roles('admin')
  async findAll(): Promise<ApiResponse<User[]>> {
    const response = await this.userService.findAll();
    return buildResponse(true, 'OK', response);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<User | null>> {
    const response = await this.userService.findOne(id);
    if (!response) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return buildResponse(true, 'OK', response);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<any>> {
    const existingUser = await this.userService.findOne(id);
    if (existingUser) {
      const response = await this.userService.update(id, updateUserDto);
      return buildResponse(true, 'Updated successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<any>> {
    const existingUser = await this.userService.findOne(id);
    if (existingUser) {
      const response = await this.userService.remove(id);
      return buildResponse(true, 'Deleted successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }

  @Patch('update-password')
  async updatePassword(
    @Req() req: Request & { user: { id: number } },
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const userId = req.user.id;
    await this.userService.updatePassword(
      userId,
      updateUserPasswordDto.currentPassword,
      updateUserPasswordDto.newPassword,
    );
    return { message: 'Password updated successfully' };
  }

  @Patch('update-tenant-info')
  async updateTenantInfo(
    @Req() req: Request & { user: { id: number } },
    @Body() updateTenantInfoDto: UpdateTenantInfoDto,
  ) {
    const userId = req.user.id;
    const updatedUser = await this.userService.updateTenantInfo(
      userId,
      updateTenantInfoDto,
    );
    return {
      message: 'Tenant information updated successfully',
      user: updatedUser,
    };
  }
}
