export const handler = (event, content) => {
  console.log(event);

  return Promise.resolve({
    statusCode: 200,
    body: 'Hello World',
  });
};
