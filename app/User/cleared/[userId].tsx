import { FlashList } from "@shopify/flash-list";
import { Text, View } from 'react-native';

import useAuthStore from '@/app/state/authState';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Divider, List } from 'react-native-paper';
type transactionListProps = {
  DateTime: string ,
  Description:string | null ,
  Amount : number , 
  type : "credit" | "debit" ,
  $id:string


}

type TransactionProps = {
  transaction: transactionListProps
}







const User = () => {

    const [data , setData]  = useState<any[]>([])

    const [error , setError] = useState(false)
    

    const [loading , setLoading] = useState(true)



    const {appwriteClient , collectionId , performRefresh} = useAuthStore()
    const TransactionList = ({transaction}:TransactionProps)=>(

      <View>

       <List.Item
       style={{marginLeft:15}}
         title= {transaction.DateTime}
         description= {transaction.Description}
         left={() =>  <List.Icon icon="wallet" color={transaction.type=="debit" ?  "red": "green"} />} //"#FFCDD2"
         right={()=><Text style={[{ alignSelf: 'center', fontWeight: "bold" , fontSize:17 }, { color: transaction.type === "debit" ? 'red' : 'green' }]}> ₹ {transaction.Amount}</Text>}
     
       />
       <Divider />
       </View>
     )
     


    const userId = useLocalSearchParams<{userId:string , userName:string}>()
    useEffect(()=>{
      // console.log("Execitong userid")
      // console.log("CollectionId is ::: " ,collectionId)
      async function iffy(){
        const dbData = await appwriteClient.getUserTransactions(collectionId , userId.userName , true)

        if(!dbData) setError(true)

        else setData(dbData)

        setLoading(false)

      }

      iffy()
    
    } , [])





    


  return (

    
    <View style={{flex:1}}>
      <Stack.Screen options={{
      headerTitle:userId.userName ,
      headerTitleAlign:"center" ,
      statusBarStyle:"dark" ,
      animation:"fade_from_bottom"
    }}/>

    {loading && <View style={{flex:1 , marginTop:200}}>
        <ActivityIndicator size={100} color={'gray'} />
        </View>}

        


      {error && <View><Text>Error occurred</Text></View>}


      {!loading && !error &&
      <FlashList
      data={data}
      renderItem={({ item }) => <TransactionList transaction = {{DateTime : item.DateTime , Description: item.Description , type:item.type , Amount:item.Amount , $id : item.$id}} />}
      keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
      estimatedItemSize={86}
    />
    }

     



    </View>
  )
}

export default User