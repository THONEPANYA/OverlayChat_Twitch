const https = require('https');
const data = JSON.stringify({
    query: `query {
      user(login: "oozie") {
        id
        login
        badges {
          setID
          version
          imageURL(size: DOUBLE)
        }
      }
    }`
});
const options = {
    hostname: 'gql.twitch.tv',
    path: '/gql',
    method: 'POST',
    headers: {
        'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
        'Content-Type': 'application/json'
    }
};
const req = https.request(options, res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => console.log(raw));
});
req.write(data);
req.end();
