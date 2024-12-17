export interface EventData {
  name: string;
  requiresInput: boolean;
  inputRequirements?: InputRequirement[];
}

export interface InputRequirement {
  key: string;
  displayValue: string;
  dataType: string;
  value: string;
}

export interface AnalyticsProcessingResponseData<T = any> {
  data: { [key: string]: T };
}
