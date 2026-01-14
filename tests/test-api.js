#!/usr/bin/env node

/**
 * NCKH Project - API Endpoint Testing Script
 * Tests all major endpoints to verify integration
 */

const http = require('http');
const https = require('https');

const API_BASE = 'http://localhost:3000/api';
const TIMEOUT = 5000;

// Test credentials
const TEST_CREDENTIALS = {
  username: 'sysadmin',
  password: '1234'
};

// Color output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testResults = {
  passed: 0,
  failed: 0,
  token: null
};

// Utility function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: TIMEOUT
    };

    // Add auth token if available
    if (testResults.token) {
      options.headers['Authorization'] = `Bearer ${testResults.token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test helper function
async function test(name, method, path, data = null, expectedStatus = 200) {
  process.stdout.write(`Testing ${name}... `);
  try {
    const response = await makeRequest(method, path, data);
    if (response.status === expectedStatus) {
      console.log(`${colors.green}✓ PASS${colors.reset} (${response.status})`);
      testResults.passed++;
      return response;
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset} (Expected ${expectedStatus}, got ${response.status})`);
      testResults.failed++;
      return null;
    }
  } catch (error) {
    console.log(`${colors.red}✗ ERROR${colors.reset} (${error.message})`);
    testResults.failed++;
    return null;
  }
}

// Main test suite
async function runTests() {
  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}  NCKH Project - API Testing${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);

  // Test 1: Health check API Gateway
  console.log(`${colors.blue}1. API Gateway Health Check${colors.reset}`);
  const gatewayResponse = await test(
    'API Gateway is running',
    'GET',
    '/auth/validate',
    null,
    401 // Expected 401 because no token provided
  );
  console.log();

  // Test 2: Auth endpoints
  console.log(`${colors.blue}2. Authentication Endpoints${colors.reset}`);
  const loginResponse = await test(
    'User login',
    'POST',
    '/auth/login',
    TEST_CREDENTIALS,
    200
  );
  
  if (loginResponse) {
    testResults.token = loginResponse.data.token;
    console.log(`   Token received: ${loginResponse.data.token.substring(0, 20)}...`);
  }
  console.log();

  // Test 3: Product endpoints
  console.log(`${colors.blue}3. Product Service Endpoints${colors.reset}`);
  
  await test(
    'Get all products',
    'GET',
    '/products',
    null,
    200
  );
  
  await test(
    'Get products by category (Nam)',
    'GET',
    '/products/category/Nam',
    null,
    200
  );
  
  await test(
    'Search products',
    'GET',
    '/products/search?keyword=shirt',
    null,
    200
  );
  console.log();

  // Test 4: Protected endpoints
  if (testResults.token) {
    console.log(`${colors.blue}4. Protected Endpoints${colors.reset}`);
    
    await test(
      'Validate token',
      'POST',
      '/auth/validate',
      null,
      200
    );
    console.log();
  }

  // Test 5: Summary
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}  Test Results${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.green}✓ Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Total: ${testResults.passed + testResults.failed}`);
  console.log();

  if (testResults.failed === 0) {
    console.log(`${colors.green}🎉 All tests passed! Your setup is working correctly.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
console.log(`\nStarting API endpoint tests...`);
console.log(`Base URL: ${API_BASE}\n`);

runTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
