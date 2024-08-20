import {setSeederFactory} from 'typeorm-extension';

import {RoleType} from '@constants';
import {UserEntity} from '@common/entities/user.entity';

export default setSeederFactory(UserEntity, faker => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({firstName, lastName});
  const phone = faker.phone.number();

  const user = new UserEntity();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.role = RoleType.USER;
  user.password = '111111';
  user.phone = phone;

  return user;
});
