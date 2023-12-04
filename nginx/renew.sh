#!/bin/sh

# Renews the certbot certificate (without having to stop the NGINX server).
certbot certonly --webroot -w /var/www/certbot --non-interactive --agree-tos --email webmaster@"$NGINX_SERVER_NAME" -d "$NGINX_SERVER_NAME"
