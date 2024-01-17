#!/bin/bash
echo 'Setting up LOCAL minikube for backstage'

# Run minikube 
minikube start --addons metrics-server --addons dashboard

# Deploy hello service
kubectl create deployment hello-minikube --image=kicbase/echo-server:1.0
kubectl expose deployment hello-minikube --type=NodePort --port=8080
kubectl port-forward service/hello-minikube 7080:8080 &

# To get default service account long lived security token
kubectl apply -f ./environment/local/minikube/default-sa-clusterrole-binding.yaml
kubectl apply -f ./environment/local/minikube/minikube-sa-secret.yaml
kubectl -n default get secret backstage-secret -o go-template='{{.data.token | base64decode}}'
echo -e "\nCopy above token to BS_K8S_MINIKUBE_TOKEN in backstage-environment-setup.local.sh"

## Get Minkube values
kubectl config view -o jsonpath='{.clusters[?(@.name == "minikube")].cluster.server}'
echo -e "\nCopy above https://ip:port to BS_K8S_MINIKUBE_URL in backstage-environment-setup.local.sh"
echo -e "\nCopy below http://ip:port to BS_K8S_DASHBOARD_URL in backstage-environment-setup.local.sh"
minikube dashboard --url

