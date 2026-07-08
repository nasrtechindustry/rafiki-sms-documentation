up:
	docker compose up -d --build
	sleep 5
	docker compose  logs -f 

logs:
	docker compose logs -f 

