import { Test, TestingModule } from '@nestjs/testing';
import { RankSourceService } from './rank-source.service';

describe('RankSourceService', () => {
  let service: RankSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankSourceService],
    }).compile();

    service = module.get<RankSourceService>(RankSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
