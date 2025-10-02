.PHONY: manifests build push app dev bash test requirements

UID:=$(shell id --user)
GID:=$(shell id --group)

dc = docker compose
run = $(dc) run --rm -u ${UID}:${GID}

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

requirements:  ## Upgrade dependencies
	$(run) upgrade $(ARGS)
