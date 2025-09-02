FROM --platform=${BUILDPLATFORM} bitnami/nginx:1.16.0-ol-7-r46

COPY index.html /opt/bitnami/nginx/html
COPY conf/maintenance_page.conf /opt/bitnami/nginx/conf/server_blocks/
