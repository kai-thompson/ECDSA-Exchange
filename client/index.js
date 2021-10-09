import "./index.scss";

const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }
  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

//post inputted private and public key to server
document.getElementById("exchange-privatekey").addEventListener('input', () => {
  const priv = document.getElementById("exchange-privatekey").value;
  const pub = document.getElementById("exchange-address").value;
  const body = JSON.stringify({pub, priv})
  fetch(`${server}/verify`,{ method: 'POST', body, headers: {'Content-Type': 'application/json'}})
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  const body = JSON.stringify({
    sender, amount, recipient
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance, status }) => {
    document.getElementById("balance").innerHTML = balance;
    //update status of transaction
    document.getElementById("status").innerHTML = status;
  });
});
