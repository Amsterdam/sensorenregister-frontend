: deploy

.PHONY: manifests

dc = docker-compose
run = $(dc) run --rm

ENVIRONMENT ?= local
HELM_ARGS = manifests/helm/application \
	-f manifests/helm/values.yaml \
	-f manifests/helm/env/${ENVIRONMENT}.yaml \
	--set image.tag=${VERSION}

REGISTRY ?= localhost:5001
REPOSITORY ?= sensorenregister/api
VERSION ?= latest

build:
	$(dc) build

push: build
	$(dc) push

deploy: manifests
	# kubectl delete deploy,service,ingress,cronjob,job,cm,secretproviderclass --all
	# Jobs are immutable
	# attempt to fix this with a helm hook that deletes itself
	# kubectl delete networkpolicy.projectcalico -l app=sensorenregister
	helm upgrade --install --atomic frontend $(HELM_ARGS)

manifests:
	@helm template backend $(HELM_ARGS) $(ARGS)

app:
	$(run) --service-ports app

dev:
	$(run) --service-ports dev

bash:
	$(run) dev bash

test:
	$(run) test-unit
