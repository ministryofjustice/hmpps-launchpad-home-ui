FROM --platform=${BUILDPLATFORM} bitnami/nginx:1.27.4-debian-12-r7

COPY index.html /opt/bitnami/nginx/html
COPY conf/maintenance_page.conf /opt/bitnami/nginx/conf/server_blocks/
