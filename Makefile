WEKO3_DIR := /home/ubuntu/Projects/weko/weko3

all: author_search refresh

install:
	docker run --rm -w /code --mount type=bind,source="$(CURDIR)/app-items-author-search",target=/code node:13 npm install
	docker run --rm -w /code --mount type=bind,source="$(CURDIR)/app-author-search",target=/code node:13 npm install

items_author_search:
	docker run --rm -w /code --mount type=bind,source="$(CURDIR)/app-items-author-search",target=/code node:13 npm run ng build -- --prod
	./cp_app_items_author_search.sh "${WEKO3_DIR}"

author_search:
	docker run --rm -w /code --mount type=bind,source="$(CURDIR)/app-author-search",target=/code node:13 npm run ng build -- --prod
	./cp_app_author_search.sh "${WEKO3_DIR}"

refresh:
	cd "${WEKO3_DIR}" && docker-compose exec -T web invenio collect -v
