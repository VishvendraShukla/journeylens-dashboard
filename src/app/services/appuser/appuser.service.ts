import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/models/apiresponse';
import { AppuserData } from 'src/app/models/appuserdata';
import { API_URLS } from 'src/app/constants/apiurls';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppuserService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  fetchAppuserData(): Observable<AppuserData | undefined> {
    return this.get<ApiResponse<AppuserData>>(
      API_URLS.APPUSER_DATA_ENDPOINT
    ).pipe(
      map((response) => {
        return response?.data;
      })
    );
  }

  createApiKey(): Observable<ApiResponse<string>> {
    return this.post<ApiResponse<string>>(API_URLS.API_KEYS_ENDPOINT, {});
  }
  updateApiKey(): Observable<ApiResponse<string>> {
    return this.put<ApiResponse<string>>(
      API_URLS.API_KEYS_ENDPOINT + '/change-state',
      {}
    );
  }
}
