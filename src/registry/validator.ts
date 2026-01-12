/**
 * Server validation utilities
 *
 * Determines whether an MCP server can be bundled into a self-contained package.
 */

import type { RegistryServer, ValidationResult } from '../types.js';

/**
 * Check if a registry server can be bundled
 */
export function validateServer(server: RegistryServer): ValidationResult {
  // Check if it's a remote-only server
  if (isRemoteOnly(server)) {
    return {
      canBundle: false,
      reason: 'Remote-only server with no source repository',
      category: 'remote-only',
    };
  }

  // Check if repository URL is valid
  if (!hasValidRepository(server)) {
    return {
      canBundle: false,
      reason: 'No valid repository URL available',
      category: 'no-source',
    };
  }

  // Server can be bundled
  return {
    canBundle: true,
  };
}

/**
 * Check if server is remote-only (has remotes but no source)
 */
function isRemoteOnly(server: RegistryServer): boolean {
  const hasRemotes = !!(server.server.remotes && server.server.remotes.length > 0);
  const hasNoRepo =
    !server.server.repository?.url || server.server.repository.url.trim() === '';

  return hasRemotes && hasNoRepo;
}

/**
 * Check if server has a valid repository URL
 */
function hasValidRepository(server: RegistryServer): boolean {
  if (!server.server.repository?.url) {
    return false;
  }

  const url = server.server.repository.url.trim();

  // Empty string
  if (url === '') {
    return false;
  }

  // Must be a valid URL
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
