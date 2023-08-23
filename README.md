# HTML to PDF conversion using puppeteer

Print your HTML to PDF via Puppeteer in a Docker container.

Heavily inspired by https://github.com/ccjmne/puppeteer-html2pdf, but adapted for purpose-specific use-case.

[![Docker Image CI](https://github.com/famoser/puppeteer-html2pdf/actions/workflows/publish-to-ghcr.yml/badge.svg)](https://github.com/ccjmne/puppeteer-html2pdf/actions/workflows/publish-to-ghcr.yml)

## Inside the box

This is a simple [Express](https://expressjs.com/) server listening for `POST` requests passing some custom HTML to print as PDF for generating fancy reports.

Technologies used:

- [Docker](https://www.docker.com/)
- [Puppeteer](https://github.com/GoogleChrome/puppeteer)
- [Express](https://expressjs.com/)
- [NodeJS](https://nodejs.org/en/)

## Run it

As a webserver, on the port of your choosing.

- Testing:

```shell
docker run -it --rm -p=<port>:3000 --network="host" ghcr.io/famoser/puppeteer-html2pdf:<version>
```

Kill with: `Ctrl^C`

- Production:

```shell
docker run --name html2pdf --detach -p=<port>:3000 \
           --shm-size 1G --sysctl net.ipv6.conf.all.disable_ipv6=1 \
           ghcr.io/famoser/puppeteer-html2pdf:<version>
```

Stop with: `docker stop html2pdf`

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

The method handle the following query parameters:

- `filename`: the name of the resulting PDF file (will automatically append the `.pdf` extension if absent)
- all the options supported by [Puppeteer's page#pdf(\[options\])](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagepdfoptions), except:
  - `path`
  - instead of `margin` (an object), pass `marginTop`, `marginLeft`, `marginRight`, `marginBottom` as query parameters 

The HTML content with dividers is of the following form:
```
<h2>Header appearing on every page<h2>
----- HEADER BODY -----
<p>Body, the actual content which flows over pages</p>
----- BODY FOOTER -----
<h2>Footer appearing on every page<h2>
```

## Build

**Automatically builds and publishes to GitHub Packages** (GitHub Container Registry) with each **GitHub Release**.

## License

MIT. Do as you please.  
Refer to the [LICENSE](./LICENSE) file for more details.
