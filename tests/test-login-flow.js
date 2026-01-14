const http = require('http');

console.log('\n=== TEST LOGIN FLOW ===\n');

// Test 1: Backend trực tiếp
console.log('1. Testing Backend (port 8080) directly...');

const backendData = JSON.stringify({
  username: '23810310082',
  password: '123456'
});

const backendOptions = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': backendData.length
  }
};

const backendReq = http.request(backendOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('\n✓ Backend Response (port 8080):');
    console.log('  Status:', res.statusCode);
    try {
      const response = JSON.parse(body);
      console.log('  Token:', response.token ? response.token.substring(0, 50) + '...' : 'N/A');
      console.log('  Username:', response.username);
      console.log('  Email:', response.email);
    } catch (e) {
      console.log('  Body:', body);
    }
    
    // Test 2: API Gateway
    console.log('\n2. Testing API Gateway (port 3000)...');
    testAPIGateway();
  });
});

backendReq.on('error', (error) => {
  console.error('✗ Backend Error:', error.message);
  console.log('\n2. Testing API Gateway (port 3000)...');
  testAPIGateway();
});

backendReq.write(backendData);
backendReq.end();

function testAPIGateway() {
  const gatewayData = JSON.stringify({
    username: '23810310082',
    password: '123456'
  });

  const gatewayOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': gatewayData.length
    }
  };

  const gatewayReq = http.request(gatewayOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log('\n✓ API Gateway Response (port 3000):');
      console.log('  Status:', res.statusCode);
      try {
        const response = JSON.parse(body);
        console.log('  Token:', response.token ? response.token.substring(0, 50) + '...' : 'N/A');
        console.log('  Username:', response.username);
        console.log('  Email:', response.email);
      } catch (e) {
        console.log('  Body:', body);
      }
    });
  });

  gatewayReq.on('error', (error) => {
    console.error('✗ API Gateway Error:', error.message);
    console.log('  Make sure API Gateway is running on port 3000');
  });

  gatewayReq.write(gatewayData);
  gatewayReq.end();
}
