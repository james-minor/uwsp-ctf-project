FROM nginx:alpine

COPY ./templates/ /etc/nginx/templates/

RUN rm -rf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]