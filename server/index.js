const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
var EC = require('elliptic').ec
const SHA256 = require('crypto-js/sha256');
var ec = new EC('secp256k1');
var key = ec.genKeyPair();
var publicKey = key.getPublic().encode('hex');

app.use(cors());
app.use(express.json());

var balances = {
  "1": 100,
  "2": 50,
  "3": 75,
};
//iterate through balances and generate key pair for each
for(let e in balances) {;
  balances[publicKey] = balances[e];
  delete balances[e];
  //log private keys(dev-feature)
  console.log(key.getPrivate().toString(16));
  key = ec.genKeyPair();
  publicKey = key.getPublic().encode('hex');
};

//log updated balances object(dev-feature)
console.log(balances)

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

//generate true or false statement by comparing inputted address combination
app.post('/verify', (req, res) => {
  const {pub, priv} = req.body;
  const privkey = ec.keyFromPrivate(priv);
  const pubkey = ec.keyFromPublic(pub, 'hex');
  const msgHash = SHA256(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString();
  const signature = privkey.sign(msgHash.toString());
  this.verification = pubkey.verify(msgHash, signature);
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  //only send transaction if this.verification boolean is true
  if(this.verification === true) {
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    //send back status messages along with new balances to client
    res.send({
      balance: balances[sender], 
      status: 'SUCCESS'
      })
    }else {
      res.send({
        balance: balances[sender], 
        status: 'INCORRECT KEY COMBINATION'
    })
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
