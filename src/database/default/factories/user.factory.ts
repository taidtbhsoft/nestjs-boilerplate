import {setSeederFactory} from 'typeorm-extension';

import {RoleType} from '@constants';
import {UserEntity} from '@common/entities/user.entity';
import {StatusType} from '@/common/constants/status-type';

export default setSeederFactory(UserEntity, faker => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({firstName, lastName});
  const phone = faker.phone.number();
  const userName = faker.internet
    .userName({firstName, lastName})
    .replace(/[^\w\s]/gi, '')
    .toLocaleLowerCase();

  const user = {
    firstName,
    lastName,
    email,
    role: RoleType.USER,
    password: 'Fsi@123456',
    phone,
    userName,
    status: StatusType.ACTIVE,
    unitCode:
      'KH_' + (Math.floor(Math.random() * 6) + 1).toString().padStart(2, '0'),
  } as UserEntity;

  return user;
});
