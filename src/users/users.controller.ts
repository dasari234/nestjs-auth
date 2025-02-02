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
import { UsersService } from './users.service';
import { User } from './schema/user.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../interfaces/api-response.interface';
import { buildResponse } from '../utils/api-response.util';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Post()
  async create(@Body() user: Partial<User>): Promise<ApiResponse<User | null>> {
    // return this.UsersService.create(user);
    const response = await this.UsersService.create(user);
    return buildResponse(true, 'OK', response);
  }

  @Get()
  // @Roles('admin')
  async findAll(): Promise<ApiResponse<User[]>> {
    const response = await this.UsersService.findAll();
    return buildResponse(true, 'OK', response);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<User | null>> {
    const response = await this.UsersService.findOne(id);
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
    const findOne = await this.UsersService.findOne(id);
    if (findOne) {
      const response = await this.UsersService.update(id, user);
      return buildResponse(true, 'Updated successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<any>> {
    const findOne = await this.UsersService.findOne(id);
    if (findOne) {
      const response = await this.UsersService.remove(id);
      return buildResponse(true, 'Deleted successfully', response);
    } else {
      return buildResponse(false, 'Record not found', '');
    }
  }
}
// @Delete(':id')
// async remove(@Param('id') id: number) {
//   try {
//     await this.UsersService.remove(id);
//     return { message: `User with ID ${id} deleted successfully` };
//   } catch (error) {
//     if (error instanceof NotFoundException) {
//       throw new HttpException(
//         {
//           statusCode: HttpStatus.NOT_FOUND,
//           message: error.message,
//         },
//         HttpStatus.NOT_FOUND,
//       );
//     }
//     throw error;
//   }
// }
