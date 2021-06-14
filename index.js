const fs=require('fs');
const url = require('url');
const http=require('http');
const slugify=require('slugify');
/*
First Script
const hello='Hello World';
console.log(hello);*/


// Reading files Synchronously and ASynchronously
/*

// writing files Synchronously  also called blocking as Nodejs basically on the single thread and using it synchronusly leads to blocking code problems.
const textIn=fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);
const textOut=`this is what we know abot avocado ${textIn} \n created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textOut);
console.log("File has been written ");

// Asynchronus Reading and writing files and also non-blocking.
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
if (err) return console.log('error');

fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
console.log(data2);
fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
console.log(data3);

fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
        console.log('file written has been done');
      });
    });
  });
});
console.log('Will read file!');*/

//Server and Listen server for creating simple web server

const replaceTemplate= (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  
  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE
if (pathname === '/' || pathname === '/overview') 
{
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
	const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
	//console.log(cardsHtml);
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
} 
// Product Page
else if (pathname === '/product')
{
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    //console.log(query);
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
}
//API
else if (pathname === '/api') 
{
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);
} 
else 
{
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
}
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening to requests on port 3000');
});