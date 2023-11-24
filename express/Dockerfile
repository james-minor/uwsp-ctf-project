FROM node:lts-alpine
WORKDIR /express

COPY . .

# Getting the Postgres connection URL
ARG CONNECTION_STRING
ENV DATABASE_URL=${CONNECTION_STRING}

# Creating the logs directory
RUN mkdir -p /express/logs

# Installing NPM packages
RUN ["npm", "install"]
