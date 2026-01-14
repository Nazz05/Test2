const http = require('http');

const testData = {
  username: 'testuser2026',
  email: 'testuser2026@example.com',
  password: 'Pass123456',
  fullName: 'Test User 2026',
  phone: '0123456789'
};

console.log('\n=== TEST REGISTER API ===');
console.log('Sending register request to Backend (port 8080)...\n');

const data = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('\nResponse Body:');
    try {
      console.log(JSON.stringify(JSON.parse(body), null, 2));
    } catch (e) {
      console.log(body);
    }
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✓ Register thanh cong!');
    } else {
      console.log('\n✗ Register that bai!');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  console.error('Make sure Backend is running on port 8080');
});

console.log('Request Data:');
console.log(JSON.stringify(testData, null, 2));
console.log('\n');

req.write(data);
req.end();
