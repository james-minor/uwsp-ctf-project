FROM nginx:alpine

# Installing dependencies.
RUN apk add certbot certbot-nginx busybox-suid

# Creating the webroot folder for Certbot.
RUN mkdir -p /var/www/certbot

# Copying template into container.
COPY ./james-minor.conf.template /etc/nginx/templates/

# Removing default configuration file.
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copying entrypoint script.
COPY entrypoint.sh /entrypoint.sh

# Copying renewal script.
COPY renew.sh /etc/periodic/weekly/renew
RUN chmod +x /etc/periodic/weekly/renew

# Making shell files executable.
RUN chmod +x /entrypoint.sh

# Running entrypoint file.
ENTRYPOINT ["/entrypoint.sh"]