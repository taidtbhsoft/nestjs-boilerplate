import {UserEntity} from '@common/entities/user.entity';
import {DataSource} from 'typeorm';
import {Seeder, SeederFactoryManager} from 'typeorm-extension';

export class User1724034017576 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<unknown> {
    // Can use dataSource
    // const repository = dataSource.getRepository(UserEntity);
    // await repository.insert([
    //   {
    //     firstName: 'Caleb',
    //     lastName: 'Barrows',
    //     email: 'caleb.barrows@gmail.com',
    //     role: RoleType.USER,
    //     password: '123456',
    //   },
    // ]);
    // return null

    const userFactory = factoryManager.get(UserEntity);
    // save 1 factory generated entity, to the database
    await userFactory.save();
    // save 5 factory generated entities, to the database

    return await userFactory.saveMany(5);
  }
}
