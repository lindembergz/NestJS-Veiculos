import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUser(): string {
    return 'Sou um user !';
  }

}
