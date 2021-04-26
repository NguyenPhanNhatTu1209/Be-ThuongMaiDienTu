const customersRouter = require('./customers');
const enterprisesRouter  = require('./enterprises');
function route(app) {
  app.use('/customers', customersRouter);
  app.use('/enterprises', enterprisesRouter);
}
module.exports = route;
