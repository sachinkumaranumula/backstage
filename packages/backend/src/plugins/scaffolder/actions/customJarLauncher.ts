import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import {
  executeShellCommand,
  RunCommandOptions,
} from '@backstage/plugin-scaffolder-backend';
import { join } from 'path';

export const customJarLauncher = () => {
  return createTemplateAction<{
    argument: string;
  }>({
    id: 'custom:tool:jar-launcher',
    schema: {
      input: {
        required: [
          'argument'
        ],
        type: 'object',
        properties: {
          argument: {
            type: 'string',
            title: 'Jar Launcher Arg',
            description:
              'Argument to Jar Launcher',
          }
        },
      },
    },
    async handler(ctx) {
      console.log(ctx);
      const workspaceDirectory: string = ctx.workspacePath;
      const custom = join(
        workspaceDirectory,
        ctx.input.argument,
        'custom.jar',
      );
      const apiDefinition = join(workspaceDirectory, ctx.input.apiSpecUrl);
      const cmdLineArgs = [
        '-jar',
        custom,
        '-arg',
        ctx.input.argument,
      ];
      if (ctx.input.database !== 'none') {
        cmdLineArgs.push('-db', ctx.input.database);
      }
      console.log(cmdLineArgs);
      const myoptions: RunCommandOptions = {
        command: `java`,
        args: cmdLineArgs,
        logStream: ctx.logStream,
      };
      await executeShellCommand(myoptions);
    },
  });
};
