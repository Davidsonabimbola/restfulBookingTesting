const { test, expect } = require('@playwright/test');
const { request } = require('http');
const { faker } = require('@faker-js/faker');
const Ajv = require('ajv');
//import Ajv from 'ajv'
//import addFormats from 'ajv-formats';
const addFormats = require('ajv-formats');



test.describe('Update booking with PUT request',()=>{

    test('update the details', {tag:'@put'}, async ({ request }) => {

    const userName = faker.person.firstName()
    const surname = faker.person.lastName()
    const totalPrice = faker.number.int()
    const depositConfirmation = faker.datatype.boolean()
    // Generate a random check-in date within the next 30 days
    const checkinDate = faker.date.future({years:1}); // 1 year from now
    const checkoutDate = faker.date.future({years:1,checkinDate}); // Checkout date after check-in date

      // Format dates to "YYYY-MM-DD"
      const formattedCheckin = checkinDate.toISOString().split('T')[0];
      const formattedCheckout = checkoutDate.toISOString().split('T')[0];
  
      // Log the dates for verification
      console.log('Check-in Date:', formattedCheckin);
      console.log('Check-out Date:', formattedCheckout);


      const reason = faker.food.description()

      const auth = 'Basic YWRtaW46cGFzc3dvcmQxMjM='
        const bookingId = 2;


        const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`,


{

    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': auth
      },

      data:
      {
        "firstname": userName,
        "lastname": surname,
        "totalprice": totalPrice,
        "depositpaid": depositConfirmation,
        "bookingdates": {
            "checkin": formattedCheckin,
            "checkout": formattedCheckout
        },
        "additionalneeds": reason
    }

} )

expect(response.status()).toBe(200);

const responseBody = await response.json();
console.log(responseBody)




const schema = {
    type: 'object',
    properties: {
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      totalprice: { type: 'number' }, // Use "number" to support larger values
      depositpaid: { type: 'boolean' },
      bookingdates: {
        type: 'object',
        properties: {
          checkin: { type: 'string', format: 'date' }, // Format to ensure date format "YYYY-MM-DD"
          checkout: { type: 'string', format: 'date' }
        },
        required: ['checkin', 'checkout'],
        additionalProperties: false
      },
      additionalneeds: { type: 'string' }
    },
    required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates', 'additionalneeds'],
    additionalProperties: false
  };

  const ajv =  new Ajv()
  addFormats(ajv);
    const validate = ajv.compile(schema);
    const valid = validate(responseBody);

    expect(valid).toBe(true);
  


        })





})