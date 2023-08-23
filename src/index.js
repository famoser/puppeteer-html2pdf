const express = require('express');
const bodyParser = require('body-parser');
const booleanParser = require('express-query-boolean');
const numberParser = require('express-query-int');
const cors = require('cors');

const pdf = require('pdfjs');
const tmp = require('tmp');

const app = express();
const port = 3000;

const limit = process.env.BODY_LIMIT || '5mb';

app.use(express.json({limit}));
app.use(bodyParser.text({type: 'text/html', limit}));
app.use(booleanParser());
app.use(numberParser());

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function print({browser, htmlContents, options}) {
  const page = await browser.newPage();
  page.on('console', message => console.log(`${message.type()} ${message.text()}`))
    .on('pageerror', ({message}) => console.error(message))
    .on('response', response => console.log(`${response.status()} ${response.url()}`))
    .on('requestfailed', request => console.warn(`${request.failure().errorText} ${request.url()}`));

  await page.setContent(htmlContents, {waitUntil: 'networkidle2'});
  return page.pdf(options);
}

function parseRequest(request) {
  const headerAndBody = request.body.split('----- HEADER BODY -----');
  const bodyAndFooter = headerAndBody[1].split('----- BODY FOOTER -----');

  const margin = {
    bottom: request.query.marginBottom ? request.query.marginBottom: 0,
    left: request.query.marginLeft ? request.query.marginLeft : 0,
    right: request.query.marginRight ? request.query.marginRight : 0,
    top: request.query.marginTop ? request.query.marginTop : 0,
  };

  return {
    htmlContents: bodyAndFooter[0],
    filename: (request.query.filename || 'document').replace(/(\.pdf)?$/, '.pdf'),
    options: {format: 'a4', landscape: false, printBackground: true, headerTemplate: headerAndBody[0], footerTemplate: bodyAndFooter[1], margin, displayHeaderFooter: true, ...request.query, path: null}  // discard potential `path` parameter
  };
}

export function use(puppeteer) {
  function launchBrowser() {
    return puppeteer.launch({
      dumpio: true,
      executablePath: 'google-chrome-stable',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });
  }

  app.post('/', cors(), async (request, response) => {
    console.log(`Received request to print`, request.query);
    try {
      const browser = await launchBrowser();
      const {htmlContents, filename, options} = parseRequest(request);
      const res = await print({htmlContents, browser, options});
      await browser.close();
      response.attachment(`${filename}.pdf`).send(res);
      console.log(`Printed`);
    } catch (error) {
      console.log('Error: ' + error);
      response.status(500).send(error);
    }
  });

  app.options('/*', cors());

  app.use((err, _, response, __) => {
    response.status(500).send(err.stack);
  });

  app.listen(port, (err) => {
    if (err) {
      return console.error('ERROR: ', err);
    }

    console.log(`HTML to PDF converter listening on port: ${port}`);
  });
}
