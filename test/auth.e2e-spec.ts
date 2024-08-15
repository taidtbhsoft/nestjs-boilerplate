import { faker } from '@faker-js/faker';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { initTest } from './init-testing-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  // Init mock data
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const password = 'password';

  beforeAll(async () => {
    app = await initTest();
  });

  it('/auth/register (POST)', () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName,
        lastName,
        email,
        password,
      })
      .expect(200));

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(200);

    accessToken = response.body.token.accessToken;
  });

  it('/auth/me (GET)', () =>
    request(app.getHttpServer())
      .get('/auth/me')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200));

  afterAll(() => app.close());
});
