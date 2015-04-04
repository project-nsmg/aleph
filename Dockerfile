FROM ubuntu:14.04
MAINTAINER sorpa'as plat <me@sorpaas.com>

RUN update-locale LANG=C.UTF-8 LC_MESSAGES=POSIX
RUN apt-get update
RUN apt-get install -y curl

RUN curl https://install.meteor.com/ | sh
WORKDIR /app
EXPOSE 3000

CMD [ "meteor" ]
