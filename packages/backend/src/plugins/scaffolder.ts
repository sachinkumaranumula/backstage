import { CatalogClient } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import {
  createZipAction,
  createSleepAction,
  createWriteFileAction,
  createAppendFileAction,
  createMergeJSONAction,
  createMergeAction,
  createParseFileAction,
  createSerializeYamlAction,
  createSerializeJsonAction,
  createJSONataAction,
  createYamlJSONataTransformAction,
  createJsonJSONataTransformAction,
} from '@roadiehq/scaffolder-backend-module-utils';
import { customJarLauncher } from './scaffolder/actions/customJarLauncher';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    reader: env.reader,
    catalogClient,
    config: env.config,
  });

  const actions = [
    ...builtInActions,
    createZipAction(),
    createSleepAction(),
    createWriteFileAction(),
    createAppendFileAction(),
    createMergeJSONAction({}),
    createMergeAction(),
    createParseFileAction(),
    createSerializeYamlAction(),
    createSerializeJsonAction(),
    createJSONataAction(),
    createYamlJSONataTransformAction(),
    createJsonJSONataTransformAction(),
    customJarLauncher()
  ];

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
  });
}
