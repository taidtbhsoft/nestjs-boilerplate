import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('createMessage')
  create(@MessageBody() payload: unknown) {
    // just an example, it will log the payload to the console.
    console.log('payload: ', payload);

    // Broadcast message to all connected clients
    this.server.emit('onMessage', payload);
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
