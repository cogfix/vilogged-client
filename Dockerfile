# Build myapp server Docker container
FROM coreos/apache
MAINTAINER Musa Musa
COPY dist /var/www/
