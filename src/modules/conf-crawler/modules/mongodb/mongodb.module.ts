import { Module } from '@nestjs/common';
import { MongodbProvider } from './mongodb.provider';

@Module({
  providers: [...MongodbProvider],
  exports : [...MongodbProvider],
})
export class MongodbModule {}
