import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService, MyDataResponse } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getAirQuality', () => {
    const mockLocation = { lat: 40.7128, lon: -74.006, key: 'your_api_key' };

    it('should return successful response with pollution data', async () => {
      const mockResponse = { ts: '2023-06-09T03:00:00.000Z', aqius: 12, mainus: 'p2', aqicn: 11, maincn: 'n2' };
      jest.spyOn(appService, 'getAirQualityNearestCity').mockResolvedValue(mockResponse);

      const result: MyDataResponse = await appController.getAirQuality(mockLocation);

      expect(result).toEqual({
        status: 'success',
        Result: { pollution: mockResponse },
      });
    });

    it('should return error response when API key is incorrect', async () => {
      const mockErrorResponse = { response: { status: 403 } };
      jest.spyOn(appService, 'getAirQualityNearestCity').mockRejectedValue(mockErrorResponse);

      const result: MyDataResponse = await appController.getAirQuality(mockLocation);

      expect(result).toEqual({ status: 'incorrect_api_key', error: 'Incorrect API key.' });
    });

    it('should return error response when an unknown error occurs', async () => {
      const mockErrorResponse = {};
      jest.spyOn(appService, 'getAirQualityNearestCity').mockRejectedValue(mockErrorResponse);

      const result: MyDataResponse = await appController.getAirQuality(mockLocation);

      expect(result).toEqual({ status: 'unknown_error', error: 'An error occurred while fetching data.' });
    });
  });
});
