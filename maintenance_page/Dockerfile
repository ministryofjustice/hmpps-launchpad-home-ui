FROM --platform=${BUILDPLATFORM} bitnami/nginx:1.27.1-debian-12-r5

COPY index.html /opt/bitnami/nginx/html
COPY conf/maintenance_page.conf /opt/bitnami/nginx/conf/server_blocks/
