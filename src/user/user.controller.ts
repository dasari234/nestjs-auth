import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../interfaces/api-response.interface';
import { buildResponse } from '../utils/api-response.util';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: Partial<User>): Promise<ApiResponse<User | null>> {
    // return this.userService.create(user);
    const response = await this.userService.create(user);
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
    @Body() user: Partial<User>,
  ): Promise<ApiResponse<any>> {
    const findOne = await this.userService.findOne(id);
    if (findOne) {
      const response = await this.userService.update(id, user);
      return buildResponse(true, 'Updated successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<any>> {
    const findOne = await this.userService.findOne(id);
    if (findOne) {
      const response = await this.userService.remove(id);
      return buildResponse(true, 'Deleted successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }
}
