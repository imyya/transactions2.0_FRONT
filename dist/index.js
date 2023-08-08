var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { showModal, hideModal, addClientToTable, fetchAndPopulateTable, fetchapi, showCodeModal, reset } from "./function.js";
import { container, fournisseurSelect, expediteurSpan, transactionSpan, destinataireSpan, accountNumber, nameInput, recipientAcc, recipientName, recipientDiv, submitButton, modal, modalButton, infoButton, historique, montantInput, errorDiv, cancelButton, transactionSelect, closeHistory, addClientButton, addAccountButton, addClientModal, closeClientModal, phoneNumberInput, addClientForm, addAccountModal, saveAccount, closeAccountModal, clientsModal, tableBody, clientlistButton, closeClientsList, API, saveClientList, filterInput, filterSelect, historyOKButton, retraitButton, retraitCodeInput, retraitModal, retraitProviderSelect, retraitTelInput, saveRetraitButton, closeRetraitModal, validationBox, retraitError } from './dom.js';
let phoneNumberRegex = /^(77|76|78|70)\d{7}$/;
;
errorDiv.style.color = "red";
let type = -1;
let transactionValue = '';
export let clientAccId = 0;
export let clientId = 0;
export let montant = -1;
let fournisseur = -1;
export let recipientAccId = 0;
export let recipientId = 0;
let code = '';
export let immediate = false;
let senderExists = false;
let recipientExists = false;
let filterSelectValue = '';
let blocked = false;
//retrait modal
let retraitCode = '';
let provider = '';
let tel = '';
export let TransacType = {
    0: "depot",
    1: "transfert",
    2: "retrait"
};
export let clients = [];
let transactions = [];
let coloredObject = {
    "OM": ["orange", "0"],
    "WV": ["blue", "1"],
    "WR": ["green", "2"],
    "CB": ["grey", "3"],
    "0": ["orange", "OM"],
    "1": ["blue", "WV"],
    "2": ["green"],
    "3": ["grey", "CB"],
};
let users = [];
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
addClientButton.addEventListener('click', () => {
    showModal(addClientModal);
});
closeClientModal.addEventListener('click', () => {
    hideModal(addClientModal);
});
addAccountButton.addEventListener('click', () => {
    showModal(addAccountModal);
});
closeAccountModal.addEventListener('click', () => {
    hideModal(addAccountModal);
});
saveAccount.addEventListener('click', () => {
    let accountNumberInput = document.getElementById('account-tel');
    let addAccountProviderSelect = document.getElementById('add-account-provider');
    let accoutntInputValue = accountNumberInput.value;
    let providerSelected = addAccountProviderSelect.value;
    let userExists = users.find((user) => user.tel === accoutntInputValue);
    if (!userExists) {
        alert('Client inexistant');
    }
    else {
        fetch(API + '/comptes/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'client_id': userExists.id,
                'balance': '0',
                'provider': providerSelected
            })
        })
            .then(response => response.json())
            .then(data => {
            console.log(data);
        })
            .catch(error => {
            console.error('Une erreur est survenue:', error);
        });
        hideModal(addAccountModal);
    }
});
addClientModal.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let phoneNumber = phoneNumberInput.value;
    phoneNumber = phoneNumber.replace(/\s/g, '');
    console.log(phoneNumber);
    if (!phoneNumberRegex.test(phoneNumber)) {
        alert('Format invalide. Utilisez le format "XX XXX XX XX" commencant par 77 76 78 ou 70');
    }
    else if (clients.some((client) => client.tel === phoneNumber)) {
        alert("Ce numero existe deja");
    }
    else {
        fetch(API + '/clients/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'firstname': firstName,
                'lastname': lastName,
                'tel': phoneNumber
            })
        })
            .then(response => response.json())
            .then(data => {
            console.log(data);
        })
            .catch(error => {
            console.error('Une erreur est survenue:', error);
        });
        addClientModal.style.display = 'none';
        addClientForm.reset();
    }
});
accountNumber.addEventListener('input', () => {
    errorDiv.innerText = '';
    let accountInput = accountNumber.value;
    let prefix = accountInput.slice(0, 2);
    // Find the client in clients array based on accountInput
    let clientMatch = clients.find((client) => client.numero_compte === accountInput);
    if ((clientMatch === null || clientMatch === void 0 ? void 0 : clientMatch.activated) == false) {
        // alert('Compte supprime')
        errorDiv.textContent = 'Client supprime';
        fournisseurSelect.disabled = true;
        recipientAcc.disabled = true;
        recipientName.disabled = true;
        montantInput.disabled = true;
        transactionSelect.disabled = true;
    }
    if (clientMatch && prefix in coloredObject) {
        nameInput.value = clientMatch.prenom + ' ' + clientMatch.nom;
        infoButton.classList.remove('hidden');
        expediteurSpan.style.backgroundColor = coloredObject[prefix][0];
        clientAccId = clientMatch.compte_id;
        blocked = clientMatch.blocked;
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
    let clientMatch = clients.find((client) => client.numero_compte === recipientInput);
    if (clientMatch && prefix in coloredObject) {
        recipientAccId = clientMatch.compte_id;
        console.log('recip acc id', recipientAccId);
        recipientName.value = clientMatch.prenom + ' ' + clientMatch.nom;
        destinataireSpan.style.backgroundColor = coloredObject[prefix][0];
        recipientExists = true;
    }
    let userMatch = users.find((user) => user.tel === recipientInput);
    if (userMatch) {
        recipientId = userMatch.id;
        recipientName.value = userMatch.firstname + ' ' + userMatch.lastname;
        recipientName.style.color = 'red';
        fournisseurSelect.value = '0';
        fournisseur = 0;
        transactionSelect.value = '1';
        type = 1;
    }
    else {
        // Clear the input fields if no match is found
        errorDiv.textContent = 'Client inexistant';
        nameInput.style.color = ''; // Reset the color to default
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
    reset();
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
            montantCell.textContent = transaction.amount;
            if (transaction.recipient_account_id == clientAccId) {
                montantCell.style.color = "green";
            }
            else if (transaction.sender_account_id == clientAccId) {
                montantCell.style.color = "red";
            }
            row.appendChild(montantCell);
            const dateCell = document.createElement('td');
            dateCell.textContent = transaction.date;
            row.appendChild(dateCell);
            if (transaction.cancelled) {
                row.style.backgroundColor = 'rgb(166, 171, 167)';
            }
            const recipientCell = document.createElement('td');
            console.log('transaction recip', transaction.recipient_account_id);
            const recip = clients.find((client) => client.compte_id == transaction.recipient_account_id);
            console.log('le recip', recip);
            recipientCell.textContent = (recip === null || recip === void 0 ? void 0 : recip.tel) || '';
            row.appendChild(recipientCell);
            tableBody.appendChild(row);
        });
    })
        .catch((error) => {
        console.error('An error occurred:', error.message);
    });
    historique.classList.remove('hidden');
});
closeHistory.addEventListener('click', () => {
    historique.classList.add('hidden');
});
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
    else if (type == 0 && fournisseur != 2 && recipientAccId == 0) { //si c depot et le destinataire na ps de compte
        errorDiv.textContent = 'Pour les depots le destinataire doit avoir un compte';
    }
    else if (type == 1 && fournisseur != 0 && (clientAccId == 0 || recipientAccId == 0)) {
        errorDiv.textContent = 'Compte expediteur et destinataire obligatoires'; //pr transfert sans code (ie pas OM with code) sender n recipient acc r mandatory
    }
    else if (type == 1 && fournisseur == 0 && clientAccId == 0) { //transf
        errorDiv.textContent = 'Compte expediteur obligatoire';
    }
    else if (type == 1 && code.length == 25 && recipientAccId == 0 && recipientId == 0) { //transf
        errorDiv.textContent = 'Destinataire obligatoire';
    }
    // else if(blocked==true && type==2){
    // }
    else if (type == 0) {
        console.log('here');
        fetchapi('depot')
            .then(data => {
            if (data && data.code) {
                showCodeModal(data.code);
            }
        });
        reset();
    }
    else if (type == 1) {
        fetchapi('transfert')
            .then(data => {
            if (data && data.code) {
                showCodeModal(data.code);
            }
            else if (data.error) {
                errorDiv.textContent = data.error;
            }
            else {
                console.log(data);
            }
        });
        reset();
    }
    else if (type == 2) {
        fetchapi('retrait')
            .then(data => {
            if (data && data.code) {
                showCodeModal(data.code);
            }
            else if (data.error) {
                errorDiv.textContent = data.error;
            }
            else {
                console.log(data);
            }
        });
        reset();
    }
});
cancelButton.addEventListener('click', () => {
    fetch(`${API}/transactions/cancel/${clientAccId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then((data) => {
        if (data.Error) {
            console.log(data.Error);
        }
        else {
            console.log(data);
        }
    })
        .catch((error) => {
        console.error('An error occurred:', error.message);
    });
});
filterSelect.addEventListener('change', () => {
    console.log('transacs', transactions);
});
window.addEventListener('click', (event) => {
    if (event.target === addClientModal) {
        hideModal(addClientModal);
    }
});
window.addEventListener('click', (event) => {
    if (event.target === clientsModal) {
        hideModal(clientsModal);
    }
});
clientlistButton.addEventListener('click', () => {
    clients.forEach((client) => {
        addClientToTable(client, tableBody);
    });
    showModal(clientsModal);
});
closeClientsList.addEventListener('click', () => {
    hideModal(clientsModal);
});
saveClientList.addEventListener('click', () => {
    hideModal(clientsModal);
});
historyOKButton.addEventListener('click', () => {
    let selectedFilterOption = filterSelect.value;
    let filterValue = filterInput.value;
    if (selectedFilterOption == "date") {
        fetchAndPopulateTable(clientAccId, filterValue, null);
    }
    else if (selectedFilterOption == "amount") {
        fetchAndPopulateTable(clientAccId, null, filterValue);
    }
    else {
        alert('Pas encore gere');
    }
    console.log('the tings', selectedFilterOption, filterValue);
});
retraitButton.addEventListener('click', () => {
    showModal(retraitModal);
});
closeRetraitModal.addEventListener('click', () => {
    hideModal(retraitModal);
});
// retraitCodeInput,retraitModal,retraitProviderSelect,
// retraitTelInput,saveRetraitButton, closeRetraitModal
saveRetraitButton.addEventListener('click', () => {
    retraitError.style.color = 'red';
    retraitCode = retraitCodeInput.value;
    provider = retraitProviderSelect.value;
    tel = retraitTelInput.value;
    let index = tel.slice(0, 2);
    console.log('the dudes', retraitCode, '**', provider, tel);
    if (provider == '' && tel == '' && retraitCode == '') {
        saveRetraitButton.disabled = true;
        retraitError.innerText = 'REMPLIR LES CHAMPS';
    }
    else if (provider == "WR") {
        retraitTelInput.disabled = true;
    }
    else if (provider == 'OM' && tel == '') {
        retraitError.textContent = 'Veuillez saisir le numero';
    }
    else {
        fetch(API + '/transactions/state', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'code': retraitCode,
                'tel': tel,
                'provider': provider
            })
        })
            .then(response => response.json())
            .then(data => {
            if (data.ok) {
                hideModal(retraitModal);
                validationBox.style.display = 'block';
                setTimeout(() => {
                    validationBox.style.display = 'none';
                }, 2000);
            }
            else {
                retraitError.textContent = data.error;
            }
        })
            .catch(error => {
            console.error('Fetch error:', error);
        });
    }
    retraitCodeInput.value = '';
    retraitProviderSelect.value = '';
    retraitTelInput.value = '';
    retraitError.textContent = '';
});
