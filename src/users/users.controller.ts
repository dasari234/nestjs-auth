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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../interfaces/api-response.interface';
import { buildResponse } from '../utils/api-response.util';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User | null>> {
    const { email } = createUserDto;
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const response = await this.usersService.create(createUserDto);
    return buildResponse(true, 'OK', response);
  }

  @Get()
  // @Roles('admin')
  async findAll(): Promise<ApiResponse<User[]>> {
    const response = await this.usersService.findAll();
    return buildResponse(true, 'OK', response);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<User | null>> {
    const response = await this.usersService.findOne(id);
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
    const existingUser = await this.usersService.findOne(id);
    if (existingUser) {
      const response = await this.usersService.update(id, updateUserDto);
      return buildResponse(true, 'Updated successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<any>> {
    const existingUser = await this.usersService.findOne(id);
    if (existingUser) {
      const response = await this.usersService.remove(id);
      return buildResponse(true, 'Deleted successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }
}
