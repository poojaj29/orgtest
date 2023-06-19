import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { lastValueFrom, map } from 'rxjs';
import { TrustRegistryService } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class RestClientService {
  constructor(private readonly httpService: HttpService, private configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post(url: string, payload: object, config?: AxiosRequestConfig): Promise<any> {
    return lastValueFrom(this.httpService.post(url, payload, config).pipe(map((response) => response.data)));
  }

  async put(url: string, payload: object, config?: AxiosRequestConfig): Promise<ResponseType> {
    return lastValueFrom(this.httpService.put(url, payload, config).pipe(map((response) => response.data)));
  }

  async trustRegistryLogin(): Promise<{ accessToken: string }> {
    const TRUST_REGISTRY_SERVICE_URL = this.configService.get('TRUST_REGISTRY_SERVICE_URL');
    const login = await this.post(`${TRUST_REGISTRY_SERVICE_URL}/${TrustRegistryService.LOGIN}`, {
      username: this.configService.get('USER_NAME'),
      password: this.configService.get('PASSWORD')
    });
    return login;
  }
}
