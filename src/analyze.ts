#!/usr/bin/env node
/**
 * MCP Registry Analysis Tool
 *
 * Fetches all servers from the official MCP Registry and categorizes them
 * by whether they can be bundled into self-contained MCPB packages.
 *
 * Categories:
 * - bundleable: Has valid GitHub/GitLab repo, can potentially be built
 * - remote-only: Has remote endpoints but no source code available
 * - no-source: Missing or invalid repository URL
 *
 * Usage:
 *   npx tsx src/analyze.ts           # Human-readable output
 *   npx tsx src/analyze.ts --json    # JSON output (stdout)
 *   npx tsx src/analyze.ts --limit 100  # Limit to first 100 servers
 */

import { fetchAllServers } from './registry/fetch.js';
import { validateServer } from './registry/validator.js';
import type { AnalysisResult } from './types.js';

async function analyzeRegistry(limit?: number): Promise<AnalysisResult> {
  const servers = await fetchAllServers(limit);

  console.error(`\nAnalyzing ${servers.length} servers...\n`);

  const bundleable: string[] = [];
  const remoteOnly: string[] = [];
  const noSource: string[] = [];

  for (const server of servers) {
    const serverName = `${server.server.name}@${server.server.version}`;
    const validation = validateServer(server);

    if (validation.canBundle) {
      bundleable.push(serverName);
    } else if (validation.category === 'remote-only') {
      remoteOnly.push(serverName);
    } else {
      noSource.push(serverName);
    }
  }

  const total = servers.length;

  return {
    timestamp: new Date().toISOString(),
    totalServers: total,
    categories: {
      bundleable: bundleable.length,
      remoteOnly: remoteOnly.length,
      noSource: noSource.length,
    },
    percentages: {
      bundleable: ((bundleable.length / total) * 100).toFixed(1) + '%',
      remoteOnly: ((remoteOnly.length / total) * 100).toFixed(1) + '%',
      noSource: ((noSource.length / total) * 100).toFixed(1) + '%',
    },
    servers: {
      bundleable,
      remoteOnly,
      noSource,
    },
  };
}

function printHumanReadable(result: AnalysisResult): void {
  console.log('='.repeat(60));
  console.log('MCP REGISTRY ANALYSIS');
  console.log('='.repeat(60));
  console.log(`\nTimestamp: ${result.timestamp}`);
  console.log(`Total Servers: ${result.totalServers}`);
  console.log('\n' + '-'.repeat(60));
  console.log('BUNDLEABILITY BREAKDOWN');
  console.log('-'.repeat(60));
  console.log(
    `\n✓ Bundleable (has source repo):     ${result.categories.bundleable} (${result.percentages.bundleable})`
  );
  console.log(
    `⊘ Remote-only (no source code):     ${result.categories.remoteOnly} (${result.percentages.remoteOnly})`
  );
  console.log(
    `✗ No source (invalid/missing URL):  ${result.categories.noSource} (${result.percentages.noSource})`
  );

  const unbundleable = result.categories.remoteOnly + result.categories.noSource;
  const unbundleablePct = ((unbundleable / result.totalServers) * 100).toFixed(1);
  console.log(`\n→ Total unbundleable: ${unbundleable} (${unbundleablePct}%)`);

  console.log('\n' + '-'.repeat(60));
  console.log('REMOTE-ONLY SERVERS (hosted services, no source)');
  console.log('-'.repeat(60));
  for (const s of result.servers.remoteOnly.slice(0, 10)) {
    console.log(`  • ${s}`);
  }
  if (result.servers.remoteOnly.length > 10) {
    console.log(`  ... and ${result.servers.remoteOnly.length - 10} more`);
  }

  console.log('\n' + '-'.repeat(60));
  console.log('NO SOURCE SERVERS (missing/invalid repo URL)');
  console.log('-'.repeat(60));
  for (const s of result.servers.noSource.slice(0, 10)) {
    console.log(`  • ${s}`);
  }
  if (result.servers.noSource.length > 10) {
    console.log(`  ... and ${result.servers.noSource.length - 10} more`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Analysis complete!');
  console.log('='.repeat(60));
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');

  // Parse --limit flag
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : undefined;

  try {
    const result = await analyzeRegistry(limit);

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printHumanReadable(result);
      console.log('\nRun with --json for machine-readable output');
    }
  } catch (error) {
    console.error('Error analyzing registry:', error);
    process.exit(1);
  }
}

main();
