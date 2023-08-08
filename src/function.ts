import {Client,Transaction} from './types.js'
import {API,modal,codeSpan,container,fournisseurSelect,transactionSpan,destinataireSpan,accountNumber,nameInput,recipientAcc,recipientName,montantInput,recipientDiv,cancelButton,transactionSelect,closeHistory,addClientButton,addAccountButton,addClientModal,closeClientModal,phoneNumberInput,addClientForm,addAccountModal, errorDiv, expediteurSpan} from './dom.js'
import { clients,TransacType,clientAccId, clientId,recipientAccId,recipientId,montant,immediate } from './index.js'

export function generateCode(length:number){
    let result=''
    let characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charLength= characters.length
    for(let i=0; i< length; i++){
        result+= characters.charAt(Math.floor(Math.random()*charLength))

    }
    return result
}


export function hideModal(modal:HTMLDivElement){
    modal.style.display='none'
}
export function showModal(modal:HTMLDivElement){
    modal.style.display='block'
}

export function addClientToTable(client:Client, tableBody: HTMLTableElement) {
  
    const row = document.createElement('tr');
  
    const prenomCell = document.createElement('td');
    prenomCell.textContent = client.prenom;
    row.appendChild(prenomCell);
  
    const nomCell = document.createElement('td');
    nomCell.textContent = client.nom;
    row.appendChild(nomCell);
  
    const telCell = document.createElement('td');
    telCell.textContent = client.tel;
    row.appendChild(telCell);
  
    const actionCell = document.createElement('td');
   
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button')
    
    deleteButton.textContent = 'Fermer';
    deleteButton.addEventListener('click', () => {
      console.log('Delete button clicked for client_id:', client.client_id);
      fetch(API +'/comptes/deactivate',{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          'id':client.compte_id
        })
      })
   

    });
    actionCell.appendChild(deleteButton);
    
    const blockButton = document.createElement('button');
    blockButton.classList.add('block-button')
    blockButton.textContent = 'Block';
    blockButton.addEventListener('click', () => {
      console.log('Block button clicked for client_id:', client.client_id);
      fetch(API +'/comptes/block',{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          'id':client.compte_id
        })
      })
   
      
    })


    
    actionCell.appendChild(blockButton);
  
    row.appendChild(actionCell);
    if(client.activated==false){
      row.style.backgroundColor="#b4b4b4b1"
      deleteButton.style.backgroundColor='#c0bfbfca'
      deleteButton.disabled=true
      blockButton.disabled=true
    }
    if(client.blocked){
      blockButton.textContent = 'Unblock';
      blockButton.style.backgroundColor="green"

    }
  
    tableBody.appendChild(row);
  }
  

  export function fetchAndPopulateTable(clientAccId: number, date: string | null, amount: string | null) {
  
    const requestBody = {
      'id': clientAccId,
      'date': date,
      'amount': amount,
    };
  
    fetch(API+'/transactions/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data: Transaction[]) => {
        const tableBody = document.querySelector('#transaction-table') as HTMLTableElement;
        tableBody.innerHTML = ''; // Clear the existing table data
  
        data.forEach((transaction) => {
          const row = document.createElement('tr');
        
    
            const typeCell = document.createElement('td');
            let theType : keyof typeof TransacType 
            theType = transaction.type
            if(theType in TransacType){
                typeCell.textContent = TransacType[theType]

            }
            row.appendChild(typeCell);

            //typeCell.textContent = transaction.type.toString();
            
    
            const montantCell = document.createElement('td');

            montantCell.textContent = transaction.amount;
            
            if(transaction.recipient_account_id==clientAccId){
                console.log('hes getting the bag')
                montantCell.style.color="green"
            }
            else if(transaction.sender_account_id == clientAccId ){
                montantCell.style.color="red"

            }
            
            row.appendChild(montantCell);
    
            const dateCell = document.createElement('td');
            dateCell.textContent = transaction.date;
            row.appendChild(dateCell);
            if(transaction.cancelled){
                row.style.backgroundColor='rgb(166, 171, 167)'
            }
            const recipientCell = document.createElement('td')
            console.log('transaction recip',transaction.recipient_account_id)
            const recip = clients.find((client)=>client.compte_id==transaction.recipient_account_id)
            console.log('le recip',recip)
            recipientCell.textContent = recip?.tel|| '';
            row.appendChild(recipientCell)
    
            tableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error('An error occurred:', error.message);
      });
  }
  
  export async function fetchapi(method: string) {
    console.log('function')
    console.log('client acc id',clientAccId )
    console.log('client id',clientId)
    console.log('recip acc id',recipientAccId)
    console.log('recip id',recipientId)
    try {
        const response = await fetch(API + `/transactions/${method}`, {
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
                'immediate': immediate
            })
        });

        const data = await response.json();

        if (data) {
            return data; // Return the entire response data object
        } else {
            throw new Error('Response does not contain the expected data.');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export function showCodeModal(code:string){
  codeSpan.style.textAlign="center"
  codeSpan.style.fontSize="1.4rem"
  codeSpan.style.color="aliceblue"
  codeSpan.textContent= code
  container.style.zIndex='-1'
  modal.style.zIndex='1'
  container.style.opacity='0.6'
}

export function reset(){
  nameInput.value=''
  accountNumber.value=''
  recipientAcc.value=''
  recipientName.value=''
  montantInput.value=''
  transactionSelect.value=''
  fournisseurSelect.value=''
  expediteurSpan.style.backgroundColor='rgba(144, 151, 161, 0.636)'
  destinataireSpan.style.backgroundColor='rgba(144, 151, 161, 0.636)'
  transactionSpan.style.backgroundColor='rgba(144, 151, 161, 0.636)'

  //errorDiv.textContent=''
}