const anomalySwaggerComponent = require('../docs/swagger/components/anomalySwaggerComponent');
const eventSwaggerComponent = require('../docs/swagger/components/eventSwaggerComponent');
const logisticSwaggerComponent = require('../docs/swagger/components/logisticSwaggerComponent');
const stepLogisticSwaggerComponent = require('../docs/swagger/components/stepLogisticSwaggerComponent');
const itemSwaggerComponent = require('../docs/swagger/components/itemSwaggerComponent');
const notificationSwaggerComponent = require('../docs/swagger/components/notificationSwaggerComponent');
const userSwaggerComponent = require('../docs/swagger/components/userSwaggerComponent');

module.exports = {
  ...anomalySwaggerComponent,
  ...eventSwaggerComponent,
  ...logisticSwaggerComponent,
  ...stepLogisticSwaggerComponent,
  ...itemSwaggerComponent,
  ...notificationSwaggerComponent,
  ...userSwaggerComponent
};