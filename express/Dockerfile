FROM node:18.18
WORKDIR /express

COPY . .

ARG CONNECTION_STRING
ENV DATABASE_URL=${CONNECTION_STRING}

RUN mkdir -p /express/logs

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

EXPOSE 8001
