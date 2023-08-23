# HTML to PDF conversion using puppeteer

Print your HTML to PDF via Puppeteer in a Docker container.

Heavily inspired by https://github.com/ccjmne/puppeteer-html2pdf.

[![Docker Image CI](https://github.com/famoser/puppeteer-html2pdf/actions/workflows/publish-to-ghcr.yml/badge.svg)](https://github.com/ccjmne/puppeteer-html2pdf/actions/workflows/publish-to-ghcr.yml)

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

## Docker Environment Variables

| Name       | Description                                                                                                               | Default Value |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| BODY_LIMIT | Maximum request body size. Passed on to [body-parser](https://github.com/expressjs/body-parser#limit) and `express.json`. | `5mb`         |

## Use it

The webserver listens on the port (specified in the [Run it](#run-it) section) and exposes two endpoints:

Single-page document, default settings (format: `A4`, orientation: `portrait`):

|                        | Single-page document       |
| ---------------------- |----------------------------|
| Request Path           | `/`                        |
| Request Method         | `POST`                     |
| `Content-Type` header  | `text/html`                |
| Request Body           | HTML content with dividers |

The HTML content with dividers is of the following form:
```
<h2>Header appearing on every page<h2>
----- HEADER BODY -----
<p>Body, the actual content which flows over pages</p>
----- BODY FOOTER -----
<h2>Footer appearing on every page<h2>
```

Further, you can pass query parameters:

- `filename` to set the name of the resulting PDF file
- the options supported by [Puppeteer's PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions). `path` is not supported. Pass `marginTop`, `marginLeft`, `marginRight`, `marginBottom` to set the `PDFMargin` object. 
