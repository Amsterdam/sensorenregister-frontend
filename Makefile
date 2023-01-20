: deploy

UID:=$(shell id --user)
GID:=$(shell id --group)

dc = docker-compose
run = $(dc) run --rm -u ${UID}:${GID}
manage = $(run) dev python manage.py
pytest = $(run) test pytest $(ARGS)

ENV = local

build:
	$(dc) build

push: build
	$(dc) push

deploy:
	kustomize build manifests/overlays/${ENV} | kubectl apply -f -

undeploy:
	kustomize build manifests/overlays/${ENV} | kubectl delete -f -

app:
	$(run) --service-ports app

dev:
	$(run) --service-ports dev

bash:
	$(run) dev bash

test:
	$(run) test-unit
