import * as mongoose from 'mongoose';
import { MongoService } from '../../token';

const MONGO_URI = process.env.MONGO_URI as  string;
export const MongodbProvider = [
  {
    provide: MongoService.DATABASE_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(MONGO_URI),
  },
];