
DOCKER=docker
DOCKER_COMPOSE=docker-compose

default: start

start:
	$(DOCKER_COMPOSE) up -d --build app
	$(DOCKER_COMPOSE) exec app npm start -- --host 0.0.0.0

clean:
	rm -rf dist	
	- $(DOCKER_COMPOSE) down

	docker-compose up -d --build app
	docker-compose exec app npm start -- --host 0.0.0.0
