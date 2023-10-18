# UWSP CTF Project

![GitHub](https://img.shields.io/github/license/james-minor/uwsp-ctf-project)

An open-source CTF game board created as a capstone project for University of Wisconsin - Stevens Point CIS 480 course.

**Note:** This repository not intended to act as a *best* way to create a CTF board, nor is this repository intended to be used
as a tutorial or guide for creating a web app. In any case, feel free to use or modify this repository in accordance
the [project license](https://github.com/james-minor/uwsp-ctf-project/blob/master/LICENSE).

For more in-depth documentation and tutorials, visit our 
[documentation website](https://james-minor.github.io/uwsp-ctf-project/).

While this repository is open-source, please note that **any** references to: UWSP, Pointers, etc.
within the repository are trademarks of the University of Wisconsin system. Unlicensed use of these trademarks can lead
to civil and criminal penalties. If you need more information regarding UWSP trademarks, see their 
[licensing policy](https://www3.uwsp.edu/ucm/standards/Pages/Trademark-and-License-Policy.aspx).

## Getting Started

Ensure you have [Docker 4.24.1](https://www.docker.com/) or newer installed.

All the services for the CTF web app have already been Dockerized, and
are all **intended to be run as services** using Docker Compose.

To start the webapp in **development** mode, which will provide watching and rebuilding of services, run:
```shell
docker compose -f compose.development.yaml watch
```
_**Note:** You will need Docker Compose version >= v2.22.0 to properly watch files._

To deploy the webapp for **production**, run:
```shell
docker compose -f compose.production.yaml up
```

If you want to run the API **test suite**, run:
```shell
docker compose -f compose.test.yaml up --exit-code-from express__test; docker compose -f compose.test.yaml down
```

