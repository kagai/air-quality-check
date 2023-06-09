import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, lastValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  private readonly nearestCityUrl = `${process.env.AIR_QUALITY_BASE_URL}/nearest_city`;
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return JSON.stringify({
      message: 'Hello World!',
    });
  }

  healthCheck(): string {
    return JSON.stringify({
      message: 'up',
    });
  }

  async getAirQualityNearestCity(lat: number, lon: number, key: string): Promise<Observable<Response>> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
      key,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.nearestCityUrl}`, { params }).pipe(
          map((r) => {
            return r.data.data.current.pollution;
          }),
        ),
      );

      this.logger.debug(`getAirQualityNearestCity result: ${JSON.stringify(response)}`);

      return response;
    } catch (error) {
      this.logger.error(`getAirQualityNearestCity error: ${JSON.stringify(error)}`);
      // propagate the error to be handled in the controller
      return Promise.reject(error);
    }
  }
}

interface Location {
  type: string;
  coordinates: number[];
}

interface Pollution {
  ts: string;
  aqius: number;
  mainus: string;
  aqicn: number;
  maincn: string;
}

interface Weather {
  ts: string;
  tp: number;
  pr: number;
  hu: number;
  ws: number;
  wd: number;
  ic: string;
}

interface Current {
  pollution: Pollution;
  weather: Weather;
}

interface Data {
  city: string;
  state: string;
  country: string;
  location: Location;
  current: Current;
}

interface Response {
  status: string;
  data: Pollution;
}

export interface MyDataResponse {
  status:
    | 'success'
    | 'call_limit_reached'
    | 'api_key_expired'
    | 'incorrect_api_key'
    | 'ip_location_failed'
    | 'no_nearest_station'
    | 'feature_not_available'
    | 'too_many_requests'
    | 'unknown_error'
    | 'error';
  data?: Data;
  error?: string;
  Result?: any;
}
