// @ts-check
const { test, expect } = require('@playwright/test');
const { request } = require('http');
import Ajv from 'ajv'

test.describe('Get methods authentication test',()=>{

    test('should retrieve the list of bookings', {tag:'@get'}, async ({ request }) => {

        const response = await request.get('/booking');

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

    // Log the response body (for debugging purposes)
    console.log('Response Body:', responseBody);

    expect(Array.isArray(responseBody)).toBe(true)


    expect(responseBody.length).toBeGreaterThan(0);

    // // Optional: Validate the first booking ID is a number (assuming response is like [{ "bookingid": 1 }, ...])
    // if (responseBody.length > 0) {
    //   expect(typeof responseBody[0].bookingid).toBe('number');
    // }






    const schema = {
        type: 'array', // The response should be an array of objects
        items: {
          type: 'object',
          properties: {
            bookingid: { type: 'number' } // Each object should have a 'bookingid' of type number
          },
          required: ['bookingid'], // 'bookingid' is required
          additionalProperties: false // No other properties should be present
        }
      };



      // Validate the schema using ajv
      const ajv =  new Ajv()
    const validate = ajv.compile(schema);
    const valid = validate(responseBody);

    // Assert that the schema is valid
    expect(valid).toBe(true);

    if (!valid) {
      console.log('Schema validation errors:', validate.errors);  // Log any schema validation errors
    }
    
    })




   





})