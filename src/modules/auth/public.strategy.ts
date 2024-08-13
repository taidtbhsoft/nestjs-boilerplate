import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  authenticate(): void {
    this.success({ [Symbol.for('isPublic')]: true });
  }
}
