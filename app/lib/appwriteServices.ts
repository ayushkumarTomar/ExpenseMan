import { ID , Client , Databases , Account ,Query } from 'appwrite';
import config from '@/constants/config';

const appwriteClient = new Client()

const APPWRITE_ENDPOINT: string = config.endpoint
const APPWRITE_PROJECT_ID:string = config.projectId;
const APPWRITE_DATABASE_ID:string = config.databaseId

type CreateUserAccount = {
    email: string;
    password: string;
    name: string
}
type LoginUserAccount = {
    email: string;
    password: string;
}
type DataItem = {
    User:string
}

type newUser = {
    User:string ,
    type : "credit" | "debit" ,
    Amount : number ,
    Description : null | string ,
    DateTime : string ,

}
class AppwriteService {
    account;
    database

    constructor(){
        appwriteClient
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)

        this.account = new Account(appwriteClient)
        this.database = new Databases(appwriteClient)
    }

    //create a new record of user inside appwrite

    async createAccount({email, password, name}: CreateUserAccount){
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
            if (userAccount) {
                return this.login({email, password})
            } else {
                return userAccount
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount() :: " + error);
            return false
            
            
        }
    }

    async login({email, password}: LoginUserAccount){
        try {
            return await this.account.createEmailSession(email.trim(), password.trim())
        } catch (error) {
            console.log("Appwrite service :: loginAccount() :: " + error);
           return false
            
            
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser() :: " + error);
            return false
        }
    }

    async logout(){
        try {
            return await this.account.deleteSession('current')
        } catch (error) {
            console.log("Appwrite service :: logoutError() :: " + error);
            return false

        }
    }


    async clearTransaction($id:string , collectionId:string){
        try {
            const cleared = await this.database.updateDocument(APPWRITE_DATABASE_ID , collectionId , $id , {
                cleared:true
            })
            // console.log(cleared)
            return cleared
        } catch (error) {
            console.log("Appwrite service :: clearTransactionError() :: " + error);
            return false

        }
    }


    async getCurrent(collectionId:string , cleared:boolean = false){

        try {

            // console.log("usingcollectionId" , collectionId)

            let query;

            if(!cleared){
            query = await this.database.listDocuments(APPWRITE_DATABASE_ID , collectionId , [Query.orderAsc("User") , Query.equal("cleared" , [false])])
            }

            else{
                query = await this.database.listDocuments(APPWRITE_DATABASE_ID , collectionId , [Query.orderAsc("User") , Query.equal("cleared" , [true])])
            }
            
            

            const uniqueNamesSet = new Set<string>();
            // @ts-ignore
            query.documents.forEach((item: DataItem) => {
            uniqueNamesSet.add(item.User);
            });
            const uniqueNamesArray: string[] = Array.from(uniqueNamesSet);

            // console.log(uniqueNamesArray)
            

            return uniqueNamesArray;

        } catch (error) {
            console.log(error)
            return false
        }
    }

    

    async getUserTransactions(collectionId:string ,userName:string , cleared:boolean = false){

        try {

            let query;

            if(!cleared){
            query = await this.database.listDocuments(APPWRITE_DATABASE_ID , collectionId , [Query.equal("User" , userName.toString()) , Query.equal("cleared" , [false])])
        }

            else{
                query = await this.database.listDocuments(APPWRITE_DATABASE_ID , collectionId , [Query.equal("User" , userName.toString()) , Query.equal("cleared" , [true])])


            }
            return query.documents

        } catch (error) {
            console.log("Appwrite Error <getUserTransaction> ::: " ,error)
            return false
        }
    }

    async AddUser(collectionId : string , newUser : newUser){

        try {
            const addData = await this.database.createDocument(APPWRITE_DATABASE_ID , collectionId , ID.unique() , {
                User: newUser.User ,
                Amount : newUser.Amount ,
                Description : newUser.Description ,
                DateTime  : newUser.DateTime ,
                type : newUser.type
            })

            // console.log("Add user :: " , addData)

            return addData
            
        } catch (error) {

            console.log("Appwrite Error<AddUser> :: " , error)
            return false
            
        }

    }
}

export default AppwriteService