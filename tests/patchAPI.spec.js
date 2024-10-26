// // @ts-check
const { test, expect } = require('@playwright/test');
const { request } = require('http');
const { faker } = require('@faker-js/faker');
const Ajv = require('ajv');

const addFormats = require('ajv-formats');


test.describe('Patch methods for partial update',()=>{

    test('partial update of details', {tag:'@patch'}, async({request})=>{
    const new_firstName = faker.person.firstName()
    const new_lastName = faker.person.lastName()

        const bookingId = 3;

const response = await request.patch(`/booking/${bookingId}`,



{

headers:{

'Content-Type': 'application/json',
'Accept': 'application/json',
'Cookie': 'token=abc123',
'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
},


data: {
    "firstname": new_firstName,
    "lastname": new_lastName
  }

})

expect(response.status()).toBe(200);
const responseBody = await response.json();
console.log(responseBody)


const schema = {
type: 'object',
properties: {
firstname : {type: 'string'},
lastname : {type: 'string'},
totalprice: {type: 'number'},
depositpaid: {type: 'boolean'},
bookingdates:{
    type: 'object',
    properties:{
        checkin: {type:'string', format:'date'},
        checkout: {type:'string', format: 'date'}
    },
    required: ['checkin', 'checkout'],
    additionalProperties: false
}

},
required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
additionalProperties: false


}

const ajv =  new Ajv()
  addFormats(ajv);
    const validate = ajv.compile(schema);
    const valid = validate(responseBody);

    expect(valid).toBe(true);

    

})


})