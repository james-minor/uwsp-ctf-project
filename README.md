# UWSP CTF Project

An open-source CTF game board created as a capstone project 
for CIS 480.

## Getting Started

All the services for the CTF web app have already been Dockerized, and
are all **intended to be ran as services** using Docker Compose.

To start the webapp in **development** mode, run:
```shell
docker-compose -f compose.development.yaml up
```

To deploy the webapp for **production**, run:
```shell
docker-compose -f compose.production.yaml up
```

