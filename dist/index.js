"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import { generateCode } from "./function";
let container = document.querySelector('.container');
let fournisseurSelect = document.querySelector('#fournisseur');
let expediteurSpan = document.querySelector('#spanexpediteur');
let transactionSpan = document.querySelector('#spantransaction');
let destinataireSpan = document.querySelector('#spandestinataire');
let accountNumber = document.querySelector('#ncompte');
let nameInput = document.querySelector('#name-input');
let recipientAcc = document.querySelector('#recipient-acc');
let recipientName = document.querySelector('#recipient-name');
let transactionSelect = document.querySelector('#transaction');
let recipientDiv = document.querySelector('.destinatairediv');
let submitButton = document.querySelector('#submit');
let codeButton = document.querySelector('.code-button');
let modal = document.querySelector('.modal');
let modalButton = document.querySelector('.modal-button');
let codeSpan = document.querySelector('.code-span');
let infoButton = document.querySelector('.info-button');
let historique = document.querySelector('.history');
let montantInput = document.querySelector('#montant-input');
let errorDiv = document.querySelector('.error');
errorDiv.style.color = "red";
codeButton.disabled = true;
let type = -1;
let transactionValue = '';
let clientAccId = 0;
let clientId = 0;
let montant = -1;
let fournisseur = -1;
let recipientAccId = 0;
let recipientId = 0;
let code = '';
let immediate = false;
let senderExists = false;
let recipientExists = false;
let TransacType = {
    0: "depot",
    1: "transfert",
    2: "retrait"
};
let clients = [];
let transactions = [];
let coloredObject = {
    "OM": ["orange", "0"],
    "WV": ["blue", "1"],
    "WR": ["green", "2"],
    "CB": ["grey", "3"],
    "0": ["orange"],
    "1": ["blue"],
    "2": ["green"],
    "3": ["grey"],
};
let users = [];
const API = 'http://127.0.0.1:8000/trans-api';
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(API + '/clients/comptes');
        const data = yield response.json();
        return data;
    });
}
fetchData().then((data) => {
    clients = data;
    //console.log(clients)
});
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(API + '/clients/noaccs');
        const data = yield response.json();
        return data;
    });
}
fetchUsers().then((data) => {
    users = data;
    console.log('users', users);
});
accountNumber.addEventListener('input', () => {
    errorDiv.innerText = '';
    let accountInput = accountNumber.value;
    let prefix = accountInput.slice(0, 2);
    // Find the client in clients array based on accountInput
    let clientMatch = clients.find((client) => client.numero_compte === accountInput);
    if (clientMatch && prefix in coloredObject) {
        nameInput.value = clientMatch.prenom + ' ' + clientMatch.nom;
        infoButton.classList.remove('hidden');
        expediteurSpan.style.backgroundColor = coloredObject[prefix][0];
        clientAccId = clientMatch.compte_id;
        //   fournisseurSelect.value=coloredObject[prefix][1]
        //   transactionSpan.style.backgroundColor=coloredObject[prefix][0]
        senderExists = true;
    }
    else {
        // Find the user in users array based on accountInput
        let userMatch = users.find((user) => user.tel === accountInput);
        if (userMatch) {
            nameInput.value = userMatch.firstname + ' ' + userMatch.lastname;
            nameInput.style.color = 'red';
            clientId = userMatch.id;
            transactionSelect.value = '0';
            type = 0;
            senderExists = true;
        }
        else {
            // Clear the input fields if no match is found
            errorDiv.textContent = 'Client inexistant';
            nameInput.value = '';
            nameInput.style.color = ''; // Reset the color to default
        }
        infoButton.classList.add('hidden');
        expediteurSpan.style.backgroundColor = ''; // Reset background color
        clientAccId = 0; // Reset the client account ID
        //transactionSelect.value='-1'
    }
});
fournisseurSelect.addEventListener('change', () => {
    let selectFournisseur;
    selectFournisseur = fournisseurSelect.value;
    fournisseur = +selectFournisseur;
    if (selectFournisseur in coloredObject) {
        fournisseurSelect.style.color = coloredObject[selectFournisseur][0];
        transactionSpan.style.backgroundColor = coloredObject[selectFournisseur][0];
        codeButton.disabled = !(selectFournisseur == "0" || selectFournisseur == "2" || selectFournisseur == "3");
        if (selectFournisseur == "2") {
            nameInput.disabled = true;
            accountNumber.disabled = true;
            recipientAcc.disabled = true;
            recipientName.disabled = true;
            transactionSelect.value = "0";
            type = 0;
        }
    }
});
codeButton.addEventListener('click', () => {
    if (fournisseur == 0) {
        code = generateCode(25);
    }
    else if (fournisseur == 2) {
        code = generateCode(15);
    }
    else {
        code = generateCode(30);
    }
    codeSpan.style.textAlign = "center";
    codeSpan.style.fontSize = "1.4rem";
    codeSpan.style.color = "aliceblue";
    codeSpan.textContent = code;
    container.style.zIndex = '-1';
    modal.style.zIndex = '1';
    container.style.opacity = '0.6';
});
montantInput.addEventListener('input', () => {
    let amount = montantInput.value;
    montant = +amount;
    console.log(typeof montant);
});
recipientAcc.addEventListener('input', () => {
    let recipientInput = recipientAcc.value;
    let prefix = recipientInput.slice(0, 2);
    console.log(prefix);
    let tel = recipientInput.slice(3);
    for (let client of clients) {
        if ((client.numero_compte == recipientInput && prefix in coloredObject) || client.tel == recipientInput) {
            //console.log(client)
            recipientAccId = client.compte_id;
            console.log(recipientAccId);
            recipientId = client.client_id;
            recipientName.value = client.prenom + ' ' + client.nom;
            // destinataireSpan.style.backgroundColor=coloredObject[prefix][0]
            recipientExists = true;
            break;
        }
    }
});
transactionSelect.addEventListener('change', () => {
    transactionValue = transactionSelect.value;
    type = +transactionValue;
    if (transactionValue == '2') {
        recipientDiv.classList.add('hidden');
    }
});
modalButton.addEventListener('click', () => {
    container.style.zIndex = '1';
    modal.style.zIndex = '-1';
    container.style.opacity = '1';
});
infoButton.addEventListener('click', () => {
    console.log('cloent', clientAccId);
    fetch(`${API}/transactions/comptes/${clientAccId}`)
        .then(response => response.json())
        .then((data) => {
        transactions = data;
        let tableBody = document.querySelector('#transaction-table');
        data.forEach(transaction => {
            const row = document.createElement('tr');
            const typeCell = document.createElement('td');
            let theType;
            theType = transaction.type;
            if (theType in TransacType) {
                typeCell.textContent = TransacType[theType];
            }
            row.appendChild(typeCell);
            //typeCell.textContent = transaction.type.toString();
            const montantCell = document.createElement('td');
            montantCell.textContent = transaction.montant;
            row.appendChild(montantCell);
            const dateCell = document.createElement('td');
            dateCell.textContent = transaction.date;
            row.appendChild(dateCell);
            tableBody.appendChild(row);
        });
    })
        .catch((error) => {
        console.error('An error occurred:', error.message);
    });
    historique.classList.remove('hidden');
});
function generateCode(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}
submitButton.addEventListener('click', () => {
    console.log(code);
    console.log(clientAccId);
    console.log(clientId);
    console.log(recipientAccId);
    console.log(recipientId);
    console.log('type', type);
    if (montant == -1) {
        errorDiv.textContent = 'Le montant ne peut pas etre nul';
    }
    //    else if(senderExists==false || recipientExists==false){
    //     errorDiv.textContent='Cet client nexiste pas'
    //    }
    else if (type == 0 && code.length > 15 && recipientAccId == 0) { //si c depot et le destinataire na ps de compte
        errorDiv.textContent = 'Pour les depots le destinataire doit avoir un compte';
    }
    else if (type == 1 && code == '' && (clientAccId == 0 || recipientAccId == 0)) {
        errorDiv.textContent = 'Compte expediteur et destinataire obligatoires'; //pr transfert sans code (ie pas OM with code) sender n recipient acc r mandatory
    }
    else if (type == 1 && code.length == 25 && clientAccId == 0) { //transf
        errorDiv.textContent = 'Compte expediteur obligatoire';
    }
    else if (type == 1 && code.length == 25 && recipientAccId == 0 && recipientId == 0) { //transf
        errorDiv.textContent = 'Destinataire obligatoire';
    }
    else if (type == 0) {
        console.log('here');
        fetchapi('depot');
    }
    else if (type == 1) {
        fetchapi('transfert');
        console.log(montant, clientAccId, recipientAccId, clientId, recipientId, code, immediate);
    }
});
// type
// amount
// account_id
// sender_id
// recipient_id
// code
// immediate
function fetchapi(method) {
    fetch(API + `/transactions/${method}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'amount': montant,
            'sender_account_id': clientAccId,
            'recipient_account_id': recipientAccId,
            'sender_id': clientId,
            'recipient_id': recipientId,
            'code': code,
            'immediate': immediate
        })
    })
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
        .then(data => {
        // handle response data here
    })
        .catch(error => {
        console.error('Error:', error);
    });
}
