import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { GithubMultiOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-github';

import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { UnprocessedEntitiesModule } from '@backstage/plugin-catalog-backend-module-unprocessed';

/*
 The sequence works as follows:
    1. The eventBroker kicks in with every new/modified changes on catalog-info.yaml.
    2. If the event is dropped for any reason, a fallback with builder.setProcessingIntervalSeconds(3600) kicks in for existing entities only.
    3. Twice per day our complete GitHub organization is scanned and onboards/updates the Components in Backstage (scheduler).
*/
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  // The GitHub URL below needs to match a configured integrations.github entry
  // specified in your app-config.
  builder.addEntityProvider(
    GithubMultiOrgEntityProvider.fromConfig(env.config, {
      id: 'orgCatalogProvider',
      githubUrl: 'https://github.com',
      // Set the following to list the GitHub orgs you wish to ingest from. You can
      // also omit this option to ingest all orgs accessible by your GitHub integration
      orgs: ['Org'],
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 60 },
        timeout: { minutes: 15 },
      }),
    }),
  );
  const githubProvider = GithubEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: {
        minutes: 720,
      } /* twice per day checking all repos and importing/refreshing in the catalog */,
      timeout: { minutes: 30 },
    }),
  });
  env.eventBroker.subscribe(
    githubProvider,
  ); /* any new add/delete/modify actions in catalog-info.yaml will be handled by the event broker */
  builder.addEntityProvider(githubProvider);
  builder.setProcessingIntervalSeconds(
    3600,
  ); /* only for existing entities, they would be refreshed if the eventBroker didn't catch the event - currently set every 1 hour */
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  const unprocessed = new UnprocessedEntitiesModule(
    // @ts-ignore
    await env.database.getClient(),
    router
  );
  unprocessed.registerRoutes();
  await processingEngine.start();
  return router;
}
