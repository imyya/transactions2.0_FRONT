//import { generateCode } from "./function";
let container = document.querySelector('.container') as HTMLDivElement
let fournisseur = document.querySelector('#fournisseur') as HTMLSelectElement;
let expediteurSpan = document.querySelector('#spanexpediteur') as HTMLSpanElement;
let transactionSpan = document.querySelector('#spantransaction') as HTMLSpanElement;
let destinataireSpan = document.querySelector('#spandestinataire') as HTMLSpanElement;
let accountNumber = document.querySelector('#ncompte') as HTMLInputElement
let nameInput = document.querySelector('#name-input') as HTMLInputElement
let recipientAcc = document.querySelector('#recipient-acc') as HTMLInputElement
let recipientName = document.querySelector('#recipient-name') as HTMLInputElement
let transactionSelect = document.querySelector('#transaction') as HTMLSelectElement
let recipientDiv = document.querySelector('.destinatairediv') as HTMLDivElement
let submitButton = document.querySelector('#submit') as HTMLButtonElement
let codeButton = document.querySelector('.code-button') as HTMLButtonElement
let modal = document.querySelector('.modal') as HTMLDivElement
let modalButton = document.querySelector('.modal-button') as HTMLButtonElement
let codeSpan = document.querySelector('.code-span') as HTMLSpanElement
let infoButton = document.querySelector('.info-button') as HTMLButtonElement
let historique = document.querySelector('.history') as HTMLDivElement

codeButton.disabled=true

let transactionValue=''
let clientAccId=0

interface Transaction{
    id:number,
    type:number,
    montant:string,
    date:string,
    compte_id:number
}
interface Client{
    client_id:number,
    compte_id:number,
    prenom:string,
    nom:string,
    tel:string,
    numero_compte:string
}

let clients: Client[]=[]
let transactions: Transaction[]=[]
let coloredObject:{[key:string]:string} ={
    "OM":"orange",
    "WV":"blue",
    "WR":"green",
    "CB":"grey",
    "0":"orange",
    "1":"blue",
    "2":"green",
    "3":"grey"  
}



let AccountNumber:{[key:string]:string[]}={
    "WV_775187667": ["775187667","Kadia Ba"],
    "OM_771234566": ["771234566", "Ousmane Sembene"],
    "WR_771234567": ["771234567", "Ndeye Khady"]

}


const API='http://127.0.0.1:8000/transacs-api' 

async function fetchData() {
    const response = await fetch(API+'/clients/comptes');
    const data: Client[] = await response.json();
    return data;
}

fetchData().then((data: Client[]) => {
   clients=data  
   console.log(clients)
});



accountNumber.addEventListener('input',() => {
    let accountInput = accountNumber.value
    
    let prefix: keyof typeof coloredObject | string = accountInput.slice(0,2)
    for (let client of clients ){
        if((client.numero_compte == accountInput && prefix in coloredObject ) || client.tel==accountInput ){
              
            nameInput.value = client.prenom + ' ' + client.nom
            infoButton.classList.remove('hidden')
            expediteurSpan.style.backgroundColor=coloredObject[prefix]
            clientAccId=client.compte_id
            codeButton.disabled=false 

            break
        }

    }
 })


 fournisseur.addEventListener('change',() => {
    let selectFournisseur: keyof typeof coloredObject ;
    selectFournisseur=fournisseur.value;
   
    if(selectFournisseur in coloredObject){
        fournisseur.style.color=coloredObject[selectFournisseur]
        transactionSpan.style.backgroundColor=coloredObject[selectFournisseur]
    }

})



recipientAcc.addEventListener('input',() => {
    let recipientInput = recipientAcc.value
    let prefix: keyof typeof coloredObject | string= recipientInput.slice(0,2)
    console.log(prefix)
    let tel =recipientInput.slice(3)
    
    for (let client of clients ){
        if((client.numero_compte==recipientInput && prefix in coloredObject ) || client.tel==recipientInput ){
            console.log(client)
            recipientName.value = client.prenom + ' ' + client.nom
            destinataireSpan.style.backgroundColor=coloredObject[prefix]
            break
        }
    

    }


})

transactionSelect.addEventListener('change', () => {
     transactionValue = transactionSelect.value
     if(transactionValue=='2'){
        recipientDiv.classList.add('hidden')
    }
    

})

codeButton.addEventListener('click', () => {
    let code = generateCode(25)
    codeSpan.style.textAlign="center"
    codeSpan.style.fontSize="1.4rem"
    codeSpan.style.color="aliceblue"
    codeSpan.textContent= code
    container.style.zIndex='-1'
    modal.style.zIndex='1'
    container.style.opacity='0.6'
})

modalButton.addEventListener('click', () => {
    container.style.zIndex='1'
    modal.style.zIndex='-1'
    container.style.opacity='1'
}

)

infoButton.addEventListener('click', () => {
    console.log('cloent',clientAccId)
    fetch(`${API}/transactions/comptes/${clientAccId}`)
    .then(response=>response.json())
    .then((data:Transaction[]) =>{
        transactions=data
        let tableBody = document.querySelector('#transaction-table') as HTMLTableElement
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
    console.error('An error occurred:', error.message)
    });
    historique.classList.remove('hidden')

})

  


    




function generateCode(length:number){
    let result=''
    let characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charLength= characters.length
    for(let i=0; i< length; i++){
        result+= characters.charAt(Math.floor(Math.random()*charLength))

    }
    return result
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