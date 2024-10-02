FROM --platform=${BUILDPLATFORM} bitnami/nginx:1.27.2-debian-12-r0

COPY index.html /opt/bitnami/nginx/html
COPY conf/maintenance_page.conf /opt/bitnami/nginx/conf/server_blocks/
