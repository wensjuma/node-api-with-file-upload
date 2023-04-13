const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config()
const headers = {
    'Authorization': 'Bearer my-token',
    'My-Custom-Header': 'foobar'
};
let BASE_URL = "https://testgateway.ekenya.co.ke:8443/ServiceLayer/"
exports.externalRequest = async (url, body) => {
    body['username'] = process.env.INTEGRATION_UNAME;
    body['password'] = process.env.INTEGRATION_KEY;
    body['clientid'] = process.env.INTEGRATION_CLIENTID;
    try {
        let response = await axios.post(BASE_URL + url, body);
        return response;
    } catch (error) {
        console.log(error.message);
        // process.exit(1)  
    }
}
exports.sendSMSRequest = async (url, body) => {
    body['username'] = process.env.INTEGRATION_UNAME;
    body['password'] = process.env.INTEGRATION_KEY;
    body['clientid'] = process.env.INTEGRATION_CLIENTID;
    body['from'] = 'ECLECTICS'
    body['transactionID'] = 'ZHD839278XS'
    try {
        let response = await axios.post(BASE_URL + url, body);
        return response;
    } catch (error) {
        console.log(error.message);
        // process.exit(1)  
        
    }
}