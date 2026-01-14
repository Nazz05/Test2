const http = require('http');

const postData = JSON.stringify({
  username: 'testuser' + Date.now(),
  email: 'test' + Date.now() + '@example.com',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log("Testing Register API...");
console.log("POST http://localhost:8080/api/auth/register");
console.log("Data:", JSON.parse(postData));
console.log("================================");

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('✓ Success! Response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('✗ Error:', error.message);
});

req.write(postData);
req.end();
