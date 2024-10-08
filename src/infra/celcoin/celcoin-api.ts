import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

import {
  IAuthenticateOnPSP,
  AuthenticateOnPSPResponse,
  ICreateLocationOnPSP,
  ICreateImmediateChargeOnPSP,
  CreateLocationOnPSPResponse,
  CreateImmediateChargeOnPSPResponse,
} from '@app/contracts';

import { ICacheManager } from '@domain/core';
import { Amount } from '@domain/value-objects';

import {
  CreateImmediateChargeException,
  PspAuthenticationException,
} from '@infra/exceptions';
import { IHttpService } from '@infra/http-service';

import { EnvironmentVariables } from '@main/config';

import {
  CelcoinAuth,
  CelcoinAuthResponse,
  CelcoinErrorResponse,
  CelcoinImmediateChargeRequest,
  CelcoinImmediateChargeResponse,
  CelcoinLocationRequest,
  CelcoinLocationResponse,
} from './contracts';

const NOT_CHANGE_VALUE = 0;
const TOKEN_CACHE_KEY = 'celcoin_token';
const TOKEN_CACHE_TTL = 2400;

export interface ICelcoinApi
  extends IAuthenticateOnPSP,
    ICreateLocationOnPSP<CelcoinAuth, Omit<CelcoinLocationRequest, 'type'>>,
    ICreateImmediateChargeOnPSP<
      CelcoinAuth,
      Omit<CelcoinImmediateChargeRequest, 'amount' | 'key'> & { amount: number }
    > {}
@Injectable()
export class CelcoinApi implements ICelcoinApi {
  constructor(
    private readonly httpService: IHttpService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly cacheManager: ICacheManager,
  ) {}

  async auth(): Promise<AuthenticateOnPSPResponse> {
    const cachedToken = await this.cacheManager.get<AuthenticateOnPSPResponse>(
      TOKEN_CACHE_KEY,
    );
    if (cachedToken) {
      return cachedToken;
    }
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append(
      'client_id',
      this.configService.getOrThrow<string>('CELCOIN_CLIENT_ID'),
    );
    data.append(
      'client_secret',
      this.configService.getOrThrow<string>('CELCOIN_CLIENT_SECRET'),
    );

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const { access_token, expires_in } = await this.httpService
      .post<CelcoinAuthResponse>({
        url: `${this.configService.getOrThrow<string>(
          'CELCOIN_HOST',
        )}/v5/token`,
        body: data,
        headers,
      })
      .catch((e) => {
        if (e.response?.data) {
          const celcoinError: CelcoinErrorResponse = e.response.data;
          throw new PspAuthenticationException(
            celcoinError?.message ?? 'failed to authenticate on Celcoin',
            e.response,
          );
        }
        throw new PspAuthenticationException(
          'failed to authenticate on Celcoin',
          e,
        );
      });

    const response = {
      accessToken: access_token,
      expiresIn: expires_in,
    };
    await this.cacheManager.set<AuthenticateOnPSPResponse>(
      TOKEN_CACHE_KEY,
      response,
      TOKEN_CACHE_TTL,
    );
    return response;
  }

  async createLocation(
    auth: CelcoinAuth,
    data: Omit<CelcoinLocationRequest, 'type' | 'clientRequestId'>,
  ): Promise<CreateLocationOnPSPResponse> {
    const headers = {
      Authorization: `Bearer ${auth.token}`,
    };
    const requestBody: CelcoinLocationRequest = {
      ...data,
      type: 'COB',
      clientRequestId: nanoid(),
    };

    const { locationId, status, emv, clientRequestId } = await this.httpService
      .post<CelcoinLocationResponse>({
        url: `${this.configService.getOrThrow<string>(
          'CELCOIN_HOST',
        )}/pix/v1/location`,
        body: requestBody,
        headers,
      })
      .catch((e) => {
        if (e.response?.data) {
          const celcoinError: CelcoinErrorResponse = e.response.data;
          throw new CreateImmediateChargeException(
            celcoinError?.message ?? 'failed to create pix location on Celcoin',
            e.response,
          );
        }
        throw new CreateImmediateChargeException(
          'failed to create pix location on Celcoin',
          e,
        );
      });

    return { locationId, status, emv, clientRequestId };
  }

  async createImmediateCharge(
    auth: CelcoinAuth,
    data: Omit<CelcoinImmediateChargeRequest, 'amount' | 'key'> & {
      amount: number;
    },
  ): Promise<CreateImmediateChargeOnPSPResponse> {
    const { locationId, amount: amountReq, ...rest } = data;
    const headers = {
      Authorization: `Bearer ${auth.token}`,
    };

    const requestBody: CelcoinImmediateChargeRequest = {
      amount: {
        original: new Amount(amountReq).toBrlString(),
        changeType: NOT_CHANGE_VALUE,
      },
      locationId,
      key: this.configService.getOrThrow<string>('CELCOIN_PIX_KEY'),
      ...rest,
    };
    const celcoinResponse = await this.httpService
      .post<CelcoinImmediateChargeResponse>({
        url: `${this.configService.getOrThrow<string>(
          'CELCOIN_HOST',
        )}/pix/v1/collection/immediate`,
        body: requestBody,
        headers,
      })
      .catch((e) => {
        if (e.response?.data) {
          const celcoinError: CelcoinErrorResponse = e.response.data;
          throw new CreateImmediateChargeException(
            celcoinError?.message ?? 'failed to create imediate cob on Celcoin',
            e.response,
          );
        }
        throw new CreateImmediateChargeException(
          'failed to create imediate cob on Celcoin',
          e,
        );
      });

    const {
      transactionId,
      status,
      lastUpdate,
      amount,
      location: {
        merchant: { city, merchantCategoryCode, name, postalCode },
        ...restLocation
      },
      calendar,
      createAt,
    } = celcoinResponse;

    return {
      providerTransactionId: transactionId.toString(),
      status,
      lastUpdate,
      amount: Amount.fromBrlString(amount.original),
      ...restLocation,
      merchant: {
        city,
        name,
        postalCode,
        merchantCategoryCode,
      },
      calendar,
      createAt,
    };
  }
}
