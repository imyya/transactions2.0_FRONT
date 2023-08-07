
export interface Transaction{
    id:number,
    type:number,
    amount:string,
    date:string,
    sender_account_id: number;
    recipient_account_id: number;
    cancelled:boolean
}

export interface Client{
    client_id:number,
    compte_id:number,
    prenom:string,
    nom:string,
    tel:string,
    numero_compte:string
    activated:boolean
    blocked:boolean
}

export interface User{
    id:number
    firstname:string,
    lastname:string,
    tel:string,
}