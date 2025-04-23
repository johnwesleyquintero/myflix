import { z } from 'zod';

export const DEFAULT_COMMAND_TIMEOUT_MS = 300000;
export const DEFAULT_COMMANDS_CONFIG = [
  {
    id: 'format',
    name: 'Formatting (Prettier)',
    command: 'npm run format',
    description: 'Checks code formatting using Prettier.',
  },
  {
    id: 'lint',
    name: 'Linting',
    command: 'npm run lint',
    description: 'Checks for code style and potential errors using ESLint.',
  },
  {
    id: 'typecheck',
    name: 'Type Checking (TSC)',
    command: 'npx tsc --noEmit',
    description: 'Performs static type checking using the TypeScript Compiler.',
  },
  {
    id: 'build',
    name: 'Build Project',
    command: 'npm run build',
    description: 'Builds the project for production.',
  },
];

const CommandCheckSchema = z.object({
  id: z
    .string({ required_error: 'Check ID is required.' })
    .min(1, 'Check ID cannot be empty.'),
  name: z
    .string({ required_error: 'Check name is required.' })
    .min(1, 'Check name cannot be empty.'),
  command: z
    .string({ required_error: 'Check command is required.' })
    .min(1, 'Check command cannot be empty.'),
  description: z
    .string()
    .optional()
    .describe('Optional description of what the check does.'),
  fallback: z
    .string()
    .optional()
    .describe(
      'Optional fallback command string to be run if the main command fails (useful for auto-fixing or alternative checks).',
    ),
  workingDirectory: z
    .string()
    .optional()
    .describe('Optional working directory for a specific command.'),
  env: z
    .record(z.string())
    .optional()
    .describe('Optional environment variables to set for a command run.'),
  timeout: z
    .number()
    .positive('Timeout must be a positive number.')
    .optional()
    .describe(
      'Optional timeout override for this specific command in milliseconds.',
    ),
});

const ErrorCategorySchema = z.object({
  patterns: z.array(z.string().min(1)).min(1),
  suggestion: z.string().optional(),
});

export const ConfigSchema = z.object({
  runInParallel: z.boolean().default(false),
  stopOnFail: z.boolean().default(false),
  commandTimeout: z.number().positive().default(DEFAULT_COMMAND_TIMEOUT_MS),
  logLevel: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info')
    .describe('Allowed log levels for the tool itself.'),
  checks: z.array(CommandCheckSchema).min(1).default(DEFAULT_COMMANDS_CONFIG),
  errorCategories: z.record(ErrorCategorySchema).default({}),
});
