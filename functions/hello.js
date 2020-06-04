exports.handler = async (event) => {
  try {
    console.log('request: ' + JSON.stringify(event, null, 2));
    return {
      statusCode: 200,
      body: 'Hello World',
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: 'Invalid event',
    };
  }
};
