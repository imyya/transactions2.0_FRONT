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
let fournisseur = document.querySelector('#fournisseur');
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
codeButton.disabled = true;
let transactionValue = '';
let clientAccId = 0;
let clients = [];
let transactions = [];
let coloredObject = {
    "OM": "orange",
    "WV": "blue",
    "WR": "green",
    "CB": "grey",
    "0": "orange",
    "1": "blue",
    "2": "green",
    "3": "grey"
};
let AccountNumber = {
    "WV_775187667": ["775187667", "Kadia Ba"],
    "OM_771234566": ["771234566", "Ousmane Sembene"],
    "WR_771234567": ["771234567", "Ndeye Khady"]
};
const API = 'http://127.0.0.1:8000/transacs-api';
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(API + '/clients/comptes');
        const data = yield response.json();
        return data;
    });
}
fetchData().then((data) => {
    clients = data;
    console.log(clients);
});
accountNumber.addEventListener('input', () => {
    let accountInput = accountNumber.value;
    let prefix = accountInput.slice(0, 2);
    for (let client of clients) {
        if ((client.numero_compte == accountInput && prefix in coloredObject) || client.tel == accountInput) {
            nameInput.value = client.prenom + ' ' + client.nom;
            infoButton.classList.remove('hidden');
            expediteurSpan.style.backgroundColor = coloredObject[prefix];
            clientAccId = client.compte_id;
            codeButton.disabled = false;
            break;
        }
    }
});
fournisseur.addEventListener('change', () => {
    let selectFournisseur;
    selectFournisseur = fournisseur.value;
    if (selectFournisseur in coloredObject) {
        fournisseur.style.color = coloredObject[selectFournisseur];
        transactionSpan.style.backgroundColor = coloredObject[selectFournisseur];
    }
});
recipientAcc.addEventListener('input', () => {
    let recipientInput = recipientAcc.value;
    let prefix = recipientInput.slice(0, 2);
    console.log(prefix);
    let tel = recipientInput.slice(3);
    for (let client of clients) {
        if ((client.numero_compte == recipientInput && prefix in coloredObject) || client.tel == recipientInput) {
            console.log(client);
            recipientName.value = client.prenom + ' ' + client.nom;
            destinataireSpan.style.backgroundColor = coloredObject[prefix];
            break;
        }
    }
});
transactionSelect.addEventListener('change', () => {
    transactionValue = transactionSelect.value;
    if (transactionValue == '2') {
        recipientDiv.classList.add('hidden');
    }
});
codeButton.addEventListener('click', () => {
    let code = generateCode(25);
    codeSpan.style.textAlign = "center";
    codeSpan.style.fontSize = "1.4rem";
    codeSpan.style.color = "aliceblue";
    codeSpan.textContent = code;
    container.style.zIndex = '-1';
    modal.style.zIndex = '1';
    container.style.opacity = '0.6';
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
            typeCell.textContent = transaction.type.toString();
            row.appendChild(typeCell);
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
// submitButton.addEventListener('click',() => {
//     fetch(API + '/transactions/store',{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json',
//         },
//         body:JSON.stringify({
//             ''
//         })
//     })
// })
