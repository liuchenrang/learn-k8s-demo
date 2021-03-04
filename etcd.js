// var Etcd = require('node-etcd');
const { Etcd3 } = require('etcd3');
var fs = require("fs")
// var options = {
//     ca:   fs.readFileSync('tls/ca/ca.pem'),
//     cert: fs.readFileSync('tls/etcd/client.pem'),
//     key:  fs.readFileSync('tls/etcd/client-key.pem')
// };
// console.log(options)

// var etcd = new Etcd("https://127.0.0.1:12379", options);
// etcd.set("key", "value");
// etcd.get("key", console.log);

const client = new Etcd3({
    hosts:["https://etcd1.k8s.dev:12379"],
    credentials: {
        rootCertificate: fs.readFileSync('tls/ca/ca.pem'),
        privateKey: fs.readFileSync('tls/etcd/client-key.pem'),
        certChain: fs.readFileSync('tls/etcd/client.pem'),
        encrypt: true
    },
    defaultCallOptions: context => context.isStream ? {} : { deadline: Date.now() + 10000 },
  });
  (async () => {
    await client.put('foo').value('bar');

    const fooValue = await client.get('foo').string();
    console.log('foo was:', fooValue);
  
    const allFValues = await client.getAll().prefix('f=').keys();
    console.log('all our keys starting with "f":', allFValues);
  
    await client.delete().all();
  })();