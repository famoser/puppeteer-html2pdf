# HTML to PDF conversion using puppeteer

[![Docker Image CI](https://github.com/famoser/puppeteer-html2pdf/actions/workflows/publish-to-ghcr.yml/badge.svg)](https://github.com/ccjmne/puppeteer-html2pdf/actions/workflows/publish-to-ghcr.yml)

Print your HTML to PDF via Puppeteer in a Docker container.

Heavily inspired by https://github.com/ccjmne/puppeteer-html2pdf.

## Run it

As a webserver, on the port of your choosing.

Testing:
```shell
docker build .
docker run -it --rm -p=<port>:3000 --network="host" <hash>
```

Production:
```shell
docker run --detach -p=<port>:3000 --shm-size 1G --sysctl net.ipv6.conf.all.disable_ipv6=1 ghcr.io/famoser/puppeteer-html2pdf:<version>
```

| Environment | Description                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| BODY_LIMIT  | Maximum request body size. Passed on to [body-parser](https://github.com/expressjs/body-parser#limit) and `express.json`. Defaults to `5mb`. |


## Use it

The webserver listens on the port (specified in the [Run it](#run-it) section) and exposes a single endpoint at `/`. With the header `Content-Type: text/html`, send a POST request with the payload consisting of the HTML of the header, the content and the footer. Like this:

```
POST /
Content-Type: text/html

<h2>Header appearing on every page<h2>
----- HEADER BODY -----
<p>Content which flows over pages</p>
----- BODY FOOTER -----
<h2>Footer appearing on every page<h2>
```

Further, you can pass query parameters:

- `filename` to set the name of the resulting PDF file
- all options supported by [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions). `path` is not supported. Pass `marginTop`, `marginLeft`, `marginRight`, `marginBottom` to set the `PDFMargin` object. 
