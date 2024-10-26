// // @ts-check
const { test, expect } = require('@playwright/test');
const { request } = require('http');
//const Ajv = require('ajv');

import Ajv from 'ajv'
//const login = require('../pages/APIconfig')
//const Ajv = require("ajv")

test.describe('Post methods authentication test',()=>{
    

test('retrieval of token', {tag:'@token'}, async({request})=>{

    // the method and url contains the header and data
    const response = await request.post('/auth',


         {

            headers:{

                'Content-Type': 'application/json',

            },

            data: {
                "username": "admin",
                "password": "password123"
              }

        }
    )


    expect(response.status()).toBe(200);

    // Get the response JSON
    const responseBody = await response.json();

    // Assert that the response contains a token
    expect(responseBody).toHaveProperty('token');
    console.log('Token:', responseBody.token);


    // ******Schema validation


    // Define the expected schema
    const schema = {
        type: 'object',
        properties: {
          token: { type: 'string' },  // token should be a string
        },
        required: ['token'],  // token is required in the response
        additionalProperties: false  // No other properties should be present
      };

      // Validate the schema using ajv
      const ajv =  new Ajv()
      //const ajv =  new Ajv()
    const validate = ajv.compile(schema);
    const valid = validate(responseBody);

    // Assert that the schema is valid
    expect(valid).toBe(true);

    if (!valid) {
      console.log('Schema validation errors:', validate.errors);  // Log any schema validation errors
    }

})

})


