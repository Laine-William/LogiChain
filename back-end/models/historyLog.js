const BaseEntity = require('./baseEntity');

  class HistoryLog extends BaseEntity {

    constructor(data) {

      super(data);
    
    this.action = data.action || '';
    this.history = data.history || new Date();
    this.userId = data.userId || null;
  }
}
module.exports = HistoryLog;