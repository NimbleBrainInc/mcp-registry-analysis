/**
 * Execute shell commands with promise interface
 */

import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(execCallback);

export interface ExecOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}

export async function exec(
  command: string,
  options: ExecOptions = {}
): Promise<{ stdout: string; stderr: string }> {
  const { cwd, env, timeout = 300000 } = options;

  return execPromise(command, {
    cwd,
    env: { ...process.env, ...env },
    timeout,
    maxBuffer: 10 * 1024 * 1024, // 10MB
  });
}
