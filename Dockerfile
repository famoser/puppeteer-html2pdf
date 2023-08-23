FROM ghcr.io/puppeteer/puppeteer:latest

LABEL org.opencontainers.image.source https://github.com/famoser/puppeteer-html2pdf
LABEL org.opencontainers.image.title Puppeteer HTML to PDF
LABEL org.opencontainers.image.description Send HTML as POST and receive back a PDF rendered by Puppeteer / Chromium.
LABEL org.opencontainers.image.authors Florian Moser <git@famoser.ch>
LABEL org.opencontainers.image.licenses MIT

USER root

RUN apt-get update && apt-get install -y dumb-init

WORKDIR /app
ADD . .
RUN npm install -y && npm run build

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "-e", "require('./dist/server.js').use(require('puppeteer-core'))"]
