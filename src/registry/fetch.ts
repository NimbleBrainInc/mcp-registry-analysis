/**
 * Fetch servers from official MCP registry with pagination
 */

import { exec } from '../utils/exec.js';
import { logger } from '../utils/logger.js';
import type { RegistryServer } from '../types.js';

const MCP_REGISTRY_URL = 'https://registry.modelcontextprotocol.io/v0.1/servers';

export async function fetchAllServers(limit?: number): Promise<RegistryServer[]> {
  logger.info('Fetching servers from MCP registry (with pagination)...');

  const allServers: RegistryServer[] = [];
  let cursor: string | null = null;
  let page = 1;
  const maxPages = 200; // Safety limit

  try {
    while (true) {
      // Build URL with pagination params (limit=100 is max page size)
      let url = `${MCP_REGISTRY_URL}?limit=100`;
      if (cursor) {
        url += `&cursor=${encodeURIComponent(cursor)}`;
      }

      // Fetch using curl
      const { stdout } = await exec(
        `curl -s '${url}' --header 'Accept: application/json'`,
        { timeout: 30000 }
      );

      const data = JSON.parse(stdout);

      if (!data.servers || !Array.isArray(data.servers)) {
        throw new Error('Invalid response from MCP registry');
      }

      allServers.push(...data.servers);

      // Check for next page
      cursor = data.metadata?.nextCursor || null;

      if (page % 10 === 0) {
        logger.info(`  Fetched ${allServers.length} servers so far (page ${page})...`);
      }

      // Stop conditions
      if (!cursor) break;
      if (limit && allServers.length >= limit) {
        allServers.splice(limit); // Trim to limit
        break;
      }
      if (page >= maxPages) {
        logger.warn(`Hit max page limit (${maxPages})`);
        break;
      }

      page++;
    }

    logger.success(`Fetched ${allServers.length} servers from MCP registry (${page} pages)`);

    return allServers;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to fetch MCP registry servers: ${message}`);
    throw error;
  }
}
