FROM nginx:alpine

# Copying templates into container.
COPY ./templates/ /etc/nginx/templates/

# Removing default configuration file.
RUN rm -rf /etc/nginx/conf.d/default.conf

# Generating a dummy SSL certificate.
RUN apk add openssl
WORKDIR /var/www/certs/
RUN openssl req -nodes -new -x509 -subj "/CN=localhost" -keyout ./privkey.pem -out ./fullchain.pem

# Starting NGINX.
CMD ["nginx", "-g", "daemon off;"]