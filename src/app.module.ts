import { Module } from '@nestjs/common';

import { UrlModule } from './url/url.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url/url.entity';

@Module({
  imports: [UrlModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3305,
    username: 'root',
    password: '1234',
    database: 'url_shortener',
    entities: [Url],
    synchronize: true
  })],
})
export class AppModule {}
