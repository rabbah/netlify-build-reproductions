const sharp = require('sharp');
const { parse } = require('url');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    console.log('request: ' + JSON.stringify(event));
    const url = JSON.parse(event.body).url;
    parse(url);

    const inputBuffer = await fetch(url).then((r) => r.buffer());
    const outputBuffer = await sharp(inputBuffer).resize(200).toBuffer();

    const body = outputBuffer.toString('base64');
    console.log(`Successfully converted '${url}' to '${body}'`);
    return {
      statusCode: 200,
      body,
      isBase64Encoded: true,
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: 'Invalid event',
    };
  }
};
