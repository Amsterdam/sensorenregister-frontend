.PHONY: manifests

dc = docker-compose
run = $(dc) run --rm

build:
	$(dc) build

push: build
	$(dc) push

app:
	$(run) --service-ports app

dev:
	$(run) --service-ports dev

bash:
	$(run) dev bash

test:
	$(run) test-unit
