/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  EventsBackend,
  HttpPostIngressEventPublisher,
} from '@backstage/plugin-events-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { GithubEventRouter, createGithubSignatureValidator } from '@backstage/plugin-events-backend-module-github';

export default async function createPlugin(
  env: PluginEnvironment,
  ): Promise<Router> {
    const eventsRouter = Router();
    const githubEventRouter = new GithubEventRouter();

  const http = HttpPostIngressEventPublisher.fromConfig({
    config: env.config,
    ingresses: {
      github: {
        validator: createGithubSignatureValidator(env.config),
      },
    },
    logger: env.logger,
  });
  http.bind(eventsRouter);

  await new EventsBackend(env.logger)
    .setEventBroker(env.eventBroker)
    .addPublishers(http, githubEventRouter)
    .addSubscribers(githubEventRouter)
    .start();

  return eventsRouter;
}
