HUGO ?= hugo
HUGO_CACHE_DIR ?= $(CURDIR)/resources/_gen/cache
PYTHON ?= python3
PORT ?= 1313

.PHONY: browser-qa browser-qa-install build serve validate

browser-qa:
	npm run qa:browser

browser-qa-install:
	npm run qa:browser:install

build:
	$(HUGO) --cacheDir "$(HUGO_CACHE_DIR)" --gc --minify --cleanDestinationDir

serve:
	$(HUGO) server --cacheDir "$(HUGO_CACHE_DIR)" --disableFastRender --port $(PORT)

validate: build
	$(PYTHON) -I scripts/validate_site.py
