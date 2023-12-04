#!/bin/sh

# Replace variables in NGINX configuration template.
envsubst < /etc/nginx/templates/james-minor.conf.template > /etc/nginx/conf.d/james-minor.conf

# Run Certbot standalone to obtain the initial SSL certificate.
certbot certonly --standalone --non-interactive --agree-tos --email webmaster@"$NGINX_SERVER_NAME" -d "$NGINX_SERVER_NAME"

# Starting NGINX.
exec nginx -g 'daemon off;'

# TODO: setup a cronjob to RENEW the certificate.
