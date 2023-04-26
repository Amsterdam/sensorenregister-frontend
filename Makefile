: deploy

.PHONY: manifests

dc = docker-compose
run = $(dc) run --rm

ENVIRONMENT ?= local
HELM_ARGS = manifests/chart \
	-f manifests/values.yaml \
	-f manifests/env/${ENVIRONMENT}.yaml \
	--set image.tag=${VERSION}

REGISTRY ?= localhost:5001
REPOSITORY ?= sensorenregister/api
VERSION ?= latest

build:
	$(dc) build

push: build
	$(dc) push

deploy: manifests
	# kubectl delete job -l 'component in (certificate)'
	helm upgrade --install --atomic frontend $(HELM_ARGS)

manifests:
	@helm template backend $(HELM_ARGS) $(ARGS)

update-chart:
	rm -rf manifests/chart
	git clone --branch 1.3.1 --depth 1 git@github.com:Amsterdam/helm-application.git manifests/chart
	rm -rf manifests/chart/.git

app:
	$(run) --service-ports app

dev:
	$(run) --service-ports dev

bash:
	$(run) dev bash

test:
	$(run) test-unit
