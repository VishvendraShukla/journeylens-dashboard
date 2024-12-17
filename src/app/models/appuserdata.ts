export interface AppuserData {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  uid: string;
  hasApiKey: boolean;
  apiKey?: string | undefined;
  apiKeyCreatedAt: string | undefined;
  isKeyActive: boolean | undefined;
}
