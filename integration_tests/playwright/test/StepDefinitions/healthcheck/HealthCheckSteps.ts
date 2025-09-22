import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { APIRequestContext, request } from '@playwright/test';

let apiContext: APIRequestContext;
let response: any;

Given('an API context', async function () {
  apiContext = await request.newContext();
});

When('I request the health endpoint', async function () {
  response = await apiContext.get('http://localhost:3000/health');
});

When('I request the health endpoint with {string}', async function (query: string) {
  response = await apiContext.get(`http://localhost:3000/health?${query}`);
});

When('I request the ping endpoint', async function () {
  response = await apiContext.get('http://localhost:3000/ping');
});

When('I request the ping endpoint with header {string} set to {string}', async function (header: string, value: string) {
  response = await apiContext.get('http://localhost:3000/ping', {
    headers: { [header]: value }
  });
});

When('I POST to the health endpoint with payload {string}', async function (payloadKey: string) {
  response = await apiContext.post('http://localhost:3000/health', {
    data: { [payloadKey]: true }
  });
});

Then('the response should indicate healthy', async function () {
  const body = await response.json();
  expect(body.healthy).toBe(true);
  expect(response.status()).toBe(200);
});

Then('the response should indicate unhealthy', async function () {
  const body = await response.json();
  expect(body.healthy).toBe(false);
  expect(response.status()).toBe(200);
});

Then('the response should be {string}', async function (expectedStatus: string) {
  const body = await response.json();
  expect(body.status).toBe(expectedStatus);
  expect(response.status()).toBe(200);
});

Then('the response should be an error', async function () {
  expect(response.status()).toBe(500);
  const body = await response.json();
  expect(body.error).toContain('Simulated error');
});