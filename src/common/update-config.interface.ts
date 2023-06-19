export interface UpdateConfigRequest {
  configs: {
    name: string;
    value: string;
  }[];
}
