const http = require('http');

const data = JSON.stringify({
  query: "Chamunda industries Hyderabad",
  category: "Mobile accessories",
  location: "Hyderabad, Telangana"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/places',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log("Competitors:", JSON.stringify(json.competitors, null, 2));
  });
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
