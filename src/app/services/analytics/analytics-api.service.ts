import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { HttpClient } from '@angular/common/http';
import {
  AnalyticsCategoryVars,
  AnalyticsCommandVars,
} from 'src/app/constants/analytics';
import { API_URLS } from 'src/app/constants/apiurls';
import { ApiResponse } from 'src/app/models/apiresponse';
import { Observable } from 'rxjs';
import {
  AnalyticsProcessingResponseData,
  EventData,
} from 'src/app/models/analyticsget';
import { AnalyticsRequestBody } from 'src/app/models/analyticsrequestbody';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsApiService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  getMetadataByCategoryName(
    analyticsCategoryVars: AnalyticsCategoryVars
  ): Observable<ApiResponse<EventData[]>> {
    const url =
      API_URLS.ANALYTICS_ENDPOINT + `?categoryName=${analyticsCategoryVars}`;
    return this.get<ApiResponse<EventData[]>>(url);
  }

  getAnalytics(
    requestBody: AnalyticsRequestBody
  ): Observable<ApiResponse<AnalyticsProcessingResponseData>> {
    const url = API_URLS.ANALYTICS_ENDPOINT;
    return this.post<ApiResponse<AnalyticsProcessingResponseData>>(
      url,
      requestBody
    );
  }
}
