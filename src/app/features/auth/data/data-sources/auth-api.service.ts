import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiClient } from '../../../../core/services/api-client.service';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';

@Injectable()
export class AuthApi {
  private readonly api = inject(ApiClient);

  login(body: LoginRequestDto): Promise<LoginResponseDto> {
    return firstValueFrom(this.api.post<LoginResponseDto>('/auth/login', body));
  }
}
