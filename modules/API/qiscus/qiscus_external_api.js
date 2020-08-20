var JitsiMeetExternalAPI = require('../external');

export default class QiscusMeetExternalAPI {
  constructor(domain, options) {
    this.meet = new JitsiMeetExternalAPI(domain, options);
  }
}
