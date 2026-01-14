const http = require('http');

const data = JSON.stringify({
  username: '23810310082',
  password: '123456'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/login',
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
    console.log('\n=== LOGIN RESPONSE ===');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('\nBody:');
    try {
      console.log(JSON.stringify(JSON.parse(body), null, 2));
    } catch (e) {
      console.log(body);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

console.log('Sending login request...');
console.log('Username: 23810310082');
console.log('Password: 123456');

req.write(data);
req.end();
