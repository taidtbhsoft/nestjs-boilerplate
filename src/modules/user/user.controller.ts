import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';

import {RoleType} from '@constants';
import {ApiPageResponse, Auth, AuthUser} from '@common/decorators';
import {PageDto} from '@common/dto/page.dto';
import {TranslationService} from '@common/shared/services/translation.service';
import {UserDto} from './dtos/user.dto';
import {UsersPageOptionsDto} from './dtos/users-page-options.dto';
import {UserEntity} from '@common/entities/user.entity';
import {UserService} from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService
  ) {}

  @Get('admin')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  async admin(@AuthUser() user: UserEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin'
    );

    return {
      text: `${translation} ${user.firstName}`,
    };
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({transform: true}))
    pageOptionsDto: UsersPageOptionsDto
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id);
  }
}
