const logger = require('./logger');

function requistLogger(request, response, next) {
  logger.info("Method: ", request.method);
  logger.info('Path:  ', request.path);
  logger.info("body: ", request.body);
  logger.info('----');
  next();
}


function unknownEndPoint(request, response) {
  response.status(404).send({error: 'unknown end point'});
}

function errorHandler(error, request, response, next) {
  logger.info(error.name);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
}


module.exports = { requistLogger, unknownEndPoint, errorHandler };
