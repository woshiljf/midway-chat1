import { Controller, Get } from '@midwayjs/decorator';

@Controller('/')
export class TestHomeController {
  @Get('/test')
  async home() {
    return 'Hello Midwayjs!------test';
  }
}
