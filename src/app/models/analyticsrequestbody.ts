import { AnalyticsCommandVars } from '../constants/analytics';
import { InputRequirement } from './analyticsget';

export interface AnalyticsRequestBody {
  commandName: AnalyticsCommandVars;
  requiresInput: boolean;
  inputRequirements?: InputRequirement[];
  parameters?: Parameters;
}

export interface Parameters {
  pageSize: number;
  currentPage: number;
}
