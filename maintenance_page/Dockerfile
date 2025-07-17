FROM --platform=${BUILDPLATFORM} bitnami/nginx:1.29.0-debian-12-r4

COPY index.html /opt/bitnami/nginx/html
COPY conf/maintenance_page.conf /opt/bitnami/nginx/conf/server_blocks/
