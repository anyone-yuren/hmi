#!/bin/sh
chown -R nginx:nginx /usr/share/nginx/html
exec "$@"