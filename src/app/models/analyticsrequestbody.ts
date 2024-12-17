import { AnalyticsCommandVars } from '../constants/analytics';
import { InputRequirement } from './analyticsget';

export interface AnalyticsRequestBody {
  commandName: AnalyticsCommandVars;
  requiresInput: boolean;
  inputRequirements?: InputRequirement[];
}
