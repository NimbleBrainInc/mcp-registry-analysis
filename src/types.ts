/**
 * Type definitions for MCP Registry servers
 */

export interface RegistryServer {
  server: {
    $schema: string;
    name: string;
    description: string;
    repository?: {
      url: string;
      source: string;
    };
    version: string;
    packages?: Package[];
    remotes?: Remote[];
  };
  _meta: {
    'io.modelcontextprotocol.registry/official': {
      status: string;
      publishedAt: string;
      updatedAt: string;
      isLatest: boolean;
    };
  };
}

export interface Package {
  registryType: string;
  identifier: string;
  transport: {
    type: string;
  };
  environmentVariables?: EnvironmentVariable[];
}

export interface Remote {
  type: string;
  url: string;
}

export interface EnvironmentVariable {
  name: string;
  description: string;
  format: string;
  isSecret: boolean;
  isRequired?: boolean;
}

export interface ValidationResult {
  canBundle: boolean;
  reason?: string;
  category?: 'remote-only' | 'no-source' | 'invalid';
}

export interface AnalysisResult {
  timestamp: string;
  totalServers: number;
  categories: {
    bundleable: number;
    remoteOnly: number;
    noSource: number;
  };
  percentages: {
    bundleable: string;
    remoteOnly: string;
    noSource: string;
  };
  servers: {
    bundleable: string[];
    remoteOnly: string[];
    noSource: string[];
  };
}
