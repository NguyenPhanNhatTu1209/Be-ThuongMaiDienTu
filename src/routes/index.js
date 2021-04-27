const customersRouter = require('./customers');
const enterprisesRouter  = require('./enterprises');
const accountsRouter  = require('./accounts');
const meRouter  = require('./me');
function route(app) {
  app.use('/customers', customersRouter);
  app.use('/enterprises', enterprisesRouter);
  app.use('/auth',accountsRouter);
  app.use('/me',meRouter);
}
module.exports = route;