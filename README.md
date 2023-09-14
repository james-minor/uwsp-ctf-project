# UWSP CTF Project

![GitHub](https://img.shields.io/github/license/james-minor/uwsp-ctf-project)

An open-source CTF game board created as a capstone project for CIS 480.

**Note:** This is not intended to be the *best* way to create a CTF board, nor is this repository intended to be used
as a tutorial or guide for creating a web app. In any case, feel free to use or modify this repository in accordance
the [project license](https://github.com/james-minor/uwsp-ctf-project/blob/master/LICENSE).

For more in-depth documentation and tutorials, visit our 
[documentation website](https://james-minor.github.io/uwsp-ctf-project/).

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

