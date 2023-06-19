export interface ResponseType {
  statusCode: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

export interface FindIssuer {
  did: string;
  verKey: string;
  '@type': string;
  '@id': string;
  '~thread': Thread;
  message?: string;
}

interface Thread {
  thid: string;
}

export interface UpdateConfig {
  name: string;
  value: string;
}

export interface CreateIssuer {
  identifier: Identifier;
  message?: string;
}
interface Identifier {
  did: string;
  verKey: string;
}
