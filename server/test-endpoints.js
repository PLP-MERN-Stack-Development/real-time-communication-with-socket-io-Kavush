const http = require('http');

const baseURL = 'http://localhost:5000';

const endpoints = [
  '/api/messages',
  '/api/users', 
  '/api/rooms',
  '/api/stats',
  '/api/health'
];

function testEndpoint(endpoint) {
  http.get(`${baseURL}${endpoint}`, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`✅ ${endpoint}: Status ${res.statusCode}`);
      try {
        const jsonData = JSON.parse(data);
        console.log(`   Response:`, jsonData);
      } catch (e) {
        console.log(`   Response: ${data}`);
      }
      console.log('---');
    });
    
  }).on('error', (err) => {
    console.log(`❌ ${endpoint}: ${err.message}`);
  });
}

console.log('🧪 Testing API Endpoints...\n');

endpoints.forEach(testEndpoint);