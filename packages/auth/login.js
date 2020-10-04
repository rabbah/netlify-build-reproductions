const login = (event, content) => {
  console.log(event);

  return {
    statusCode: 200,
    body: 'Login',
  };
};

exports.main = login;
