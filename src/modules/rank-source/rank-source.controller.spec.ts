import { Test, TestingModule } from '@nestjs/testing';
import { RankSourceController } from './rank-source.controller';

describe('RankSourceController', () => {
  let controller: RankSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankSourceController],
    }).compile();

    controller = module.get<RankSourceController>(RankSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
