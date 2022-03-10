server:
	npx webpack serve

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

pretty:
	npx prettier --write ./src/assets/scss && npx prettier --write ./src/assets/scripts

lint:
	npx eslint --fix ./src

.PHONY: test
