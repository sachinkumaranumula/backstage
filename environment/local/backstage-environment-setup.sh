#!/bin/bash

echo 'Setting up LOCAL environment variables for backstage plugins'

# AuthN
export BS_AUTH_PROVIDER_CLIENT_ID=
export BS_AUTH_PROVIDER_CLIENT_SECRET=
# Org GitHub
export ORG_GITHUB_HOST=
export BS_INTEGRATION_ORG_GITHUB_APP_CREDENTIALS=
# Needed if webhook is setup that triggers event backend for instant updates to catalog instead of scheduled
export BS_CATALOG_PROVIDER_WEBHOOK_SECRET={REPLACE_WITH_CREATED_SECRET}
# OPTIONAL: Needed for k8s plugin to read kubernetes cluster
export BS_K8S_MINIKUBE_URL=
export BS_K8S_MINIKUBE_TOKEN=
export BS_K8S_DASHBOARD_URL=
