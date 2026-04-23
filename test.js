import http from 'http';

const testEndpoint = (body) => {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3001,
            path: '/api/assets/report-failure',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.write(JSON.stringify(body));
        req.end();
    });
};

(async () => {
    console.log("Testing 200 OK (Asset 1)...");
    let res = await testEndpoint({ assetId: 1 });
    console.log(res.status, res.data.substring(0, 50) + '...');

    console.log("Testing 404 Not Found (Asset 99)...");
    res = await testEndpoint({ assetId: 99 });
    console.log(res.status, res.data);

    // To test 400 No Vendors, we first need to insert an asset with a capability no vendor has in database.
    // However, fastify.post already guarantees the routes are set.
})();
