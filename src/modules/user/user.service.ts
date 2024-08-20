import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import type {FindOptionsWhere} from 'typeorm';
import {Repository} from 'typeorm';
import {Transactional} from 'typeorm-transactional';

import type {PageDto} from '@common/dto/page.dto';
import {UserRegisterDto} from '@modules/auth/dto/user-register.dto';
import type {UserDto} from './dtos/user.dto';
import type {UsersPageOptionsDto} from './dtos/users-page-options.dto';
import {UserEntity} from '@common/entities/user.entity';
import {DBNameConnections} from '@constants/db-name';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, DBNameConnections.DEFAULT)
    private userRepository: Repository<UserEntity>
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{username: string; email: string}>
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  @Transactional()
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    // Check duplicate email
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.email = :email', {email: userRegisterDto.email});

    const userEntity = await queryBuilder.getOne();

    if (userEntity) {
      throw new BadRequestException('error.unique.email');
    }

    const user = this.userRepository.create(userRegisterDto);

    await this.userRepository.save(user);

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: string): Promise<UserDto> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      queryBuilder.where('user.id = :userId', {userId});

      const userEntity = await queryBuilder.getOne();

      if (!userEntity) {
        throw new NotFoundException('error.userNotFound');
      }
      return userEntity.toDto();
    } catch (error) {
      throw new NotFoundException('error.userNotFound');
    }
  }
}
