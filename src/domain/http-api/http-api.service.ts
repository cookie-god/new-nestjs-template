import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { FailServiceCallException } from 'src/config/exception/service.exception';
import { logger } from 'src/config/logger/logger';

@Injectable()
export class HttpApiService {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T> {
    try {
      logger.info(
        '=====================================================================================================',
      );
      logger.info(`[Service Call] GET ${url}`);
      logger.info('[Header] ', headers);
      logger.info('[Query Params] ', params);
      const response = await firstValueFrom(
        this.httpService.get<T>(url, { params, headers }),
      );
      logger.info(
        '=====================================================================================================',
      );
      logger.info('[Response] ', response.data);
      logger.info(
        '=====================================================================================================',
      );
      return response.data;
    } catch (error) {
      throw FailServiceCallException(error.message);
    }
  }

  async post<T>(
    url: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    try {
      logger.info(
        '=====================================================================================================',
      );
      logger.info(`[Service Call] POST ${url}`);
      logger.info('[Header] ', headers);
      logger.info('[Body] ', data);
      logger.info(
        '=====================================================================================================',
      );
      const response = await firstValueFrom(
        this.httpService.post<T>(url, data, { headers }),
      );
      logger.info('[Response] ', response.data);
      logger.info(
        '=====================================================================================================',
      );
      return response.data;
    } catch (error) {
      throw FailServiceCallException(error.message);
    }
  }

  async put<T>(
    url: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    try {
      logger.info(
        '=====================================================================================================',
      );
      logger.info(`[Service Call] PUT ${url}`);
      logger.info('[Header] ', headers);
      logger.info('[Body] ', data);
      const response = await firstValueFrom(
        this.httpService.put<T>(url, data, { headers }),
      );
      logger.info(
        '=====================================================================================================',
      );
      logger.info('[Response] ', response.data);
      logger.info(
        '=====================================================================================================',
      );
      return response.data;
    } catch (error) {
      throw FailServiceCallException(error.message);
    }
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    try {
      logger.info(
        '=====================================================================================================',
      );
      logger.info(`[Service Call] DELETE ${url}`);
      logger.info('[Header] ', headers);
      const response = await firstValueFrom(
        this.httpService.delete<T>(url, { headers }),
      );
      logger.info(
        '=====================================================================================================',
      );
      logger.info('[Response] ', response.data);
      logger.info(
        '=====================================================================================================',
      );
      return response.data;
    } catch (error) {
      throw FailServiceCallException(error.message);
    }
  }
}
