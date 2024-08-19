import {INestApplication} from '@nestjs/common';
import {io, Socket} from 'socket.io-client';
import {initTest} from './init-testing-app';

describe('EventsGateway', () => {
  let app: INestApplication;
  let socket: Socket;

  beforeAll(async () => {
    app = await initTest();
    await app.listen(3000);
  });

  beforeEach(done => {
    socket = io('http://localhost:3000');
    socket.on('connect', () => {
      done();
    });
  });

  afterEach(() => {
    socket.disconnect();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('identity', () => {
    it('should return the same number has what was sent', done => {
      socket.emit('identity', 0, (response: unknown) => {
        expect(response).toBe(0);
        done();
      });
    });
  });

  describe('createMessage', () => {
    it('should return the same message has what was sent', done => {
      const msg = 'Hello world';
      socket.emit('createMessage', msg);
      socket.on('onMessage', data => {
        expect(data).toBe(msg);
        done();
      });
    });
  });
});
