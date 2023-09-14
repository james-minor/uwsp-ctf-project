FROM node:18-alpine
WORKDIR /express

COPY . .

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

EXPOSE 8000

RUN mkdir -p /express/logs