FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    npm install -g pm2

RUN git clone https://github.com/JoseMCO/Micah.git /var/app && \
    cd /var/app && yarn install

COPY config.js /var/app/config.js

CMD cd /var/app && pm2-docker index.js --name="micah"