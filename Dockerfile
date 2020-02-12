ARG BUILD_FROM
FROM $BUILD_FROM

ADD . /data

ENV LANG C.UTF-8

RUN apk add --update \
    nodejs npm

RUN npm install -g pm2

COPY ./start.sh /start.sh
RUN chmod a+x /start.sh

ADD ./data /bot
WORKDIR /bot

RUN npm install

CMD ["/start.sh"]