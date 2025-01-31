import { HttpModule } from '@nestjs/axios';
import { HttpApiService } from './http-api.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  providers: [HttpApiService],
  exports: [HttpApiService],
})
export class HttpApiModule {}
