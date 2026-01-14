const http = require('http');

const testRegister = () => {
  const postData = JSON.stringify({
    username: 'testuser' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'test123'
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

  const req = http.request(options, (res) => {
    console.log(`\n✓ Register Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('Response:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`✗ Error: ${e.message}`);
  });

  req.write(postData);
  req.end();
};

console.log('Testing Backend API Connection...');
console.log('================================');
testRegister();
