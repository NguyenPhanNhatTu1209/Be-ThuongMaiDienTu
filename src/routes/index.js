const customersRouter = require('./customers');
const enterprisesRouter  = require('./enterprises');
const accountsRouter  = require('./accounts');
function route(app) {
  app.use('/customers', customersRouter);
  app.use('/enterprises', enterprisesRouter);
  app.use('/auth',accountsRouter);
}
module.exports = route;