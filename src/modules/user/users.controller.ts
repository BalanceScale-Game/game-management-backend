import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

// Decorator
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';

// Guard
import JwtAuthGuard from '../auth/guard/jwtAuth.guard';

// Service
import { UsersService } from './users.service';

// Dto
import { UpdateUserDto } from './dto';

// Model
import { User } from 'src/models';

@Controller('user')
@UseFilters(AllExceptionsFilter)
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Get user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Get user unsuccessfully',
  })
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Query() queries) {
    const { email } = queries;
    const users = this.usersService.getByEmail(email);
    return users;
  }

  @Patch('/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Update user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Update user unsuccessfully',
  })
  async updateUserById(
    @Req() request,
    @Param() params,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = params;
    const updatedUser = await this.usersService.updateUserById(
      Number(userId),
      updateUserDto,
    );
    return updatedUser;
  }
}
