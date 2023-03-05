import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Service
import { UsersService } from '../user/users.service';
import { AuthService } from './auth.service';

// Dto
import { GetUserFromTokenDto, LoginDto, RegisterDto } from './dto';

// Guard
import JwtAuthGuard from './guard/jwtAuth.guard';
import JwtRefreshGuard from './guard/jwtRefresh.guard';

// Model
import { User } from 'src/models';

import MongooseClassSerializerInterceptor from 'src/configs/interceptors/mongooseClassSerializer.interceptor';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';

@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
@UseFilters(AllExceptionsFilter)
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Register successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Register unsuccessfully',
  })
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authService.register(registrationData);

    return user;
  }

  @HttpCode(200)
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Login unsuccessfully',
  })
  async logIn(@Req() req, @Body() loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.authService.getAuthenticatedUser(email, password);
    const accessTokenData = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshTokenData = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );

    await this.usersService.setCurrentRefreshToken(
      refreshTokenData.token,
      user.id,
    );

    req.res.setHeader('Set-Cookie', [
      accessTokenData.cookie,
      refreshTokenData.cookie,
    ]);

    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Logout successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Logout unsuccessfully',
  })
  async logOut(@Req() request, @Res() response: Response) {
    const { user } = request;
    await this.usersService.removeRefreshToken(user.id);

    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiResponse({
    status: 200,
    description: 'Refresh token successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Refresh token unsuccessfully',
  })
  refresh(@Req() request) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return user;
  }

  @MessagePattern('auth.get.user')
  async getUserFromAuthenticationToken(
    @Payload() message: GetUserFromTokenDto,
  ) {
    const user = this.authService.getUserFromAuthenticationToken(message.token);
    return user;
  }
}
