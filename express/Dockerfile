FROM node:lts-alpine
WORKDIR /express

COPY . .

ARG CONNECTION_STRING
ENV DATABASE_URL=${CONNECTION_STRING}

RUN mkdir -p /express/logs

RUN ["npm", "install"]
