const http = require('http');
const fs = require('fs');
const url = require('url');
// const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

const data = fs.readFileSync('./data/data.json', 'utf-8');
const productData = JSON.parse(data);

// const slugs = productData.map(prod => slugify(prod.productName, {lower: true}));
// console.log(slugs);

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);

    if ((pathname === '/') || (pathname === '/overview')) {

        const cardTemp = productData.map(item => replaceTemplate(tempCard, item));

        const finalTemp = tempOverview.replace('{%PRODUCT_CARD%}', cardTemp);
        
        res.end(finalTemp);

    } else if (pathname === '/product') {

        const product = productData[query.id];

        const output = replaceTemplate(tempProduct, product);

        // res.writeHead(200, {"Content-Type": "application/json"});
        res.end(output);

    } else if (pathname === '/api') {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(data);
    } else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<h>Page not found!</h1>");
    }
});

const port = 8000;
server.listen(port, '127.0.0.1', () => {
    console.log(`Server running on http://localhost:${port}`);
});