FROM node:0.12
MAINTAINER sorpa'as plat <me@sorpaas.com>
EXPOSE 3000

RUN npm install -g grunt-cli
RUN npm install -g bower

ADD . /app
WORKDIR /app
RUN npm install
RUN bower install --allow-root
RUN grunt browserify

CMD bin/www
