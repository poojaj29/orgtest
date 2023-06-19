export enum AgentService {
  NATS_ENDPOINT = 'AGENT_SERVICE',
  UPDATE_ORG_CONFIG = 'updateOrgConfig',
  CREATE_ISSUER = 'createIssuer',
  FIND_ISSUER = 'findIssuer'
}
export enum CommonConstants {
  NATS_CLIENT = 'organization-service',
  REQUEST_TIMEOUT = 40000
}

export enum NATSService {
  NATS_ENDPOINT = 'ORGANIZATION_SERVICE',
  WRITE_CRED_DEF = 'writeCredDef',
  WRITE_SHEMA = 'writeSchema',
  PROOF_SCHEMA_TEMPLATE = 'proofSchemaTemplate'
}

export enum TrustRegistryService {
  NATS_CLIENT = 'TRUST_REGISTRY_SERVICE',
  CREATE_ORG = 'createOrganization',
  ORGANIZATION = 'organization',
  LOGIN = 'auth/login'
}
