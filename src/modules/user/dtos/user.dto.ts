import {ApiProperty} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {RoleType} from '@constants';
import {AbstractDto} from '@common/dto/abstract.dto';
import {UserEntity} from '@common/entities/user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{isActive: boolean}>;

export class UserDto extends AbstractDto {
  @IsString()
  @ApiProperty({name: 'firstName', type: String, required: false})
  @IsEmpty()
  firstName?: string | null;

  @IsString()
  @ApiProperty({name: 'lastName', type: String, required: false})
  @IsEmpty()
  lastName?: string | null;

  @IsString()
  @ApiProperty({name: 'username', type: String, required: false})
  @IsEmpty()
  username!: string;

  @IsEmpty()
  @ApiProperty({
    name: 'role',
    type: String,
    required: false,
    default: RoleType.USER,
  })
  @IsEnum(RoleType, {each: true})
  role?: RoleType;

  @IsOptional()
  @IsEmail()
  @ApiProperty({name: 'email', type: String, required: true})
  email?: string | null;

  @IsString()
  @ApiProperty({name: 'avatar', type: String, required: false})
  @IsEmpty()
  avatar?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({name: 'phone', type: String, required: false, minLength: 10})
  @Length(10)
  phone?: string | null;

  @IsBoolean()
  @ApiProperty({name: 'isActive', type: Boolean, required: false})
  @IsEmpty()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}
