# [Backstage](https://backstage.io)

Scaffolded Backstage App for Org, Good Luck!

## Setup
> Github Setup
* Create Org, Teams as you desire
* Setup a GitHub App for backstage 
  * [App Settings](./environment/local/github/backstage-github-app-settings.pdf)
  * [App Permissions](./environment/local/github/backstage-github-app-organization-permissions.pdf)
  * Copy [GitHub App Credentials](./environment/local/github/backstage-github-app-credentials.yaml) as `backstage-github-app-credentials.local.yaml`

> K8s minikube (OPTIONAL)
* Setup minikube & Docker Desktop
* In a separate shell, run [./environment/local/minikube/minikube-setup.sh](./environment/local/minikube/minikube-setup.sh) 
* Look at shell output to copy values into `backstage-environment-setup.local.sh`

> Webhook (OPTIONAL) - used for catalog provider to pick up catalog entity updates at source control
* Create channel at smee.io (use channel at GitHub Org Webhook and below -u arg)
* ```
  npm install --global smee-client
  smee -u https://smee.io/{REPLACE_WITH_CREATED_CHANNEL} -t http://localhost:7007/api/events/http/github
  ```
* Setup Org [Webhook Settings](./environment/local/github/backstage-github-webhook-settings.pdf)
* Copy secret generated to `BS_CATALOG_PROVIDER_WEBHOOK_SECRET` at `backstage-environment-setup.local.sh`

## Local Run
> Environment Variables
* copy [env shell script](./environment/local/backstage-environment-setup.sh) as `backstage-environment-setup.local.sh` and fillout the values

> Install
```sh
yarn install
```

> Local Run
* To start the app locally, run:
```sh
source backstage-environment-setup.local.sh
yarn dev
```

## Upgrade
> Upgrade
* See https://backstage.io/docs/getting-started/keeping-backstage-updated
* check https://backstage.github.io/upgrade-helper/, run:
```sh
yarn backstage-cli versions:bump
```

## Noob
* Best resource to get overview: https://backstage.spotify.com/
* Modeling: https://backstage.io/docs/features/software-catalog/system-model/
* Entity Lifecycle: https://backstage.io/docs/features/software-catalog/life-of-an-entity/
  
# Notes from Setup
## Open Ports
frontend: 3000, backend: 7007

## Windows Laptop Needs
- https://docs.docker.com/desktop/install/windows-install/ (docs relies on docker)
- https://github.com/nodejs/node-gyp#on-windows (scaffolder relies on isolated-vm)

## Catalog priming (Ingesting existing software ecosystems)
* https://backstage.io/docs/features/software-catalog/external-integrations/
* https://backstage.io/docs/integrations/github/discovery/

## Templating
All scaffolder actions http://localhost:3000/create/actions

## Plugins
#### AuthN Plugin
* https://backstage.io/docs/getting-started/configuration#setting-up-authentication
* https://backstage.io/docs/auth/github/provider
#### Github Integration Plugin
* https://backstage.io/docs/getting-started/configuration#setting-up-a-github-integration
* https://backstage.io/docs/integrations/github/locations
* Permissions to set on Organization: https://roadie.io/docs/details/github-app-permissions/#roadie-backstage

#### Useful backstage repos
* https://github.com/backstage/actions #github actions for backstage deploy
* https://github.com/backstage/software-templates #software templates that can be registered
* https://github.com/backstage/charts #eval helm chart
