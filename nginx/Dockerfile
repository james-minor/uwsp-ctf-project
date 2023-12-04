FROM nginx:alpine

# Installing Certbot.
RUN apk add certbot certbot-nginx

# Copying template into container.
COPY ./james-minor.conf.template /etc/nginx/templates/

# Removing default configuration file.
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copying the entrypoint script to run Certbot and start NGINX.
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]