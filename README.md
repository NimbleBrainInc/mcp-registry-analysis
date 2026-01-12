# MCP Registry Analysis

Analyze the official [MCP Registry](https://registry.modelcontextprotocol.io) to determine how many servers can be bundled into self-contained packages.

## Why This Exists

The Model Context Protocol ecosystem has thousands of servers, but not all of them can be bundled for offline/air-gapped deployment. This tool categorizes every server in the registry by its "bundleability":

- **Bundleable**: Has a valid GitHub/GitLab repository with source code
- **Remote-only**: Hosted services with no source code available (SaaS integrations, etc.)
- **No source**: Missing or invalid repository URL

## Latest Results

Analysis run: January 12, 2026

| Category    | Count     | Percentage |
| ----------- | --------- | ---------- |
| Bundleable  | 2,739     | 79.3%      |
| Remote-only | 457       | 13.2%      |
| No source   | 258       | 7.5%       |
| **Total**   | **3,454** | 100%       |

**Bottom line**: ~80% of the MCP ecosystem can be bundled for enterprise deployment.

## Usage

```bash
# Clone and install
git clone https://github.com/NimbleBrainInc/mcp-registry-analysis.git
cd mcp-registry-analysis
npm install

# Run analysis (human-readable output)
npm run analyze

# Run analysis (JSON output)
npm run analyze:json > results.json

# Quick test with limited servers
npm run analyze -- --limit 100
```

## Output

### Human-readable

```
============================================================
MCP REGISTRY ANALYSIS
============================================================

Timestamp: 2026-01-12T08:15:32.123Z
Total Servers: 3454

------------------------------------------------------------
BUNDLEABILITY BREAKDOWN
------------------------------------------------------------

✓ Bundleable (has source repo):     2739 (79.3%)
⊘ Remote-only (no source code):     457 (13.2%)
✗ No source (invalid/missing URL):  258 (7.5%)

→ Total unbundleable: 715 (20.7%)

------------------------------------------------------------
REMOTE-ONLY SERVERS (hosted services, no source)
------------------------------------------------------------
  • server-name@1.0.0
  • another-server@2.1.0
  ... and more

============================================================
Analysis complete!
============================================================
```

### JSON

```json
{
  "timestamp": "2026-01-12T08:15:32.123Z",
  "totalServers": 3454,
  "categories": {
    "bundleable": 2739,
    "remoteOnly": 457,
    "noSource": 258
  },
  "percentages": {
    "bundleable": "79.3%",
    "remoteOnly": "13.2%",
    "noSource": "7.5%"
  },
  "servers": {
    "bundleable": ["server-a@1.0.0", "..."],
    "remoteOnly": ["server-b@1.0.0", "..."],
    "noSource": ["server-c@1.0.0", "..."]
  }
}
```

## How It Works

1. Fetches all servers from registry.modelcontextprotocol.io (paginated, ~116 pages)
2. Examines each server's `repository.url` field
3. Categorizes based on:
   - Valid GitHub/GitLab URL with source code → bundleable
   - Has `remoteUrl` but no source repo → remote-only
   - Invalid or missing repository URL → no-source

## Performance

- Full analysis: ~45 seconds (fetches ~35 pages at 100 servers/page)
- Quick test: ~5 seconds with `--limit 100`

## Requirements

- Node.js 18+

## License

MIT

## Related

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Registry](https://registry.modelcontextprotocol.io)
- [NimbleBrain](https://www.nimblebrain.ai)
