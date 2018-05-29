const request = require('request');
var util = require('util')
class RestAPI {
  doRequest(url, method) {
    return new Promise(function (resolve, reject) {
      const options = {
      url: url,
      method: method,
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
        }
      };

      request(options, function (error, res, body) {

        if (!error && res.statusCode == 200) {
          let json = JSON.parse(body);
          console.log(json);
          resolve(json);
        } else {
          reject(error);
        }
      });
    });
  }

  async getIPAddress(url, method) {
    let res = await this.doRequest(url, method)
    return res;
  }
}
module.exports = new RestAPI();
