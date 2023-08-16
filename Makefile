: deploy

.PHONY: manifests

dc = docker-compose
run = $(dc) run --rm

ENVIRONMENT ?= local
HELM_ARGS = manifests/chart \
	-f manifests/values.yaml \
	-f manifests/env/${ENVIRONMENT}.yaml \
	--set image.tag=${VERSION}

REGISTRY ?= localhost:5000
REPOSITORY ?= opdrachten/sensorenregister-frontend
VERSION ?= latest

build:
	$(dc) build

push: build
	$(dc) push

deploy: manifests
	# kubectl delete job -l 'component in (certificate)'
	helm upgrade --install --atomic ssr-frontend $(HELM_ARGS)

manifests:
	@helm template ssr-frontend $(HELM_ARGS) $(ARGS)

update-chart:
	rm -rf manifests/chart
	git clone --branch 1.7.0 --depth 1 git@github.com:Amsterdam/helm-application.git manifests/chart
	rm -rf manifests/chart/.git

app:
	$(run) --service-ports app

dev:
	$(run) --service-ports dev

bash:
	$(run) dev bash

test:
	$(run) test-unit
