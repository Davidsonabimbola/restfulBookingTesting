// pages/AuthAPI.js
import Ajv from 'ajv';

export class AuthAPI {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    this.ajv = new Ajv();
    this.schema = {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
      required: ['token'],
      additionalProperties: false,
    };
  }

  async getAuthToken(username, password) {
    const response = await this.request.post('https://restful-booker.herokuapp.com/auth', {
      headers: { 'Content-Type': 'application/json' },
      data: { username, password },
    });

    if (response.status() !== 200) {
      throw new Error(`Authentication failed with status ${response.status()}`);
    }

    const responseBody = await response.json();
    if (!this.validateResponse(responseBody)) {
      console.log('Schema validation errors:', this.validate.errors);
      throw new Error('Schema validation failed');
    }

    return responseBody.token;
  }

  validateResponse(responseBody) {
    const validate = this.ajv.compile(this.schema);
    return validate(responseBody);
  }
}
