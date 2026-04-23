import http from 'http';

const sendPost = (assetId) => {
    const req = http.request({
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/assets/report-failure',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    req.write(JSON.stringify({ assetId }));
    req.end();
};

setTimeout(() => {
    console.log("Triggering Asset 1");
    sendPost(1);
}, 3000);

setTimeout(() => {
    console.log("Triggering Asset 2");
    sendPost(2);
}, 6000);

setTimeout(() => {
    console.log("Triggering Asset 1 again");
    sendPost(1);
}, 9000);
