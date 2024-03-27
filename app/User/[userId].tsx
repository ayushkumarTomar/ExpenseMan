import { FlashList } from "@shopify/flash-list";
import { Alert, Text, View } from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ActivityIndicator, Divider, List } from 'react-native-paper';
import useAuthStore from '../state/authState';
type transactionListProps = {
  DateTime: string,
  Description: string | null,
  Amount: number,
  type: "credit" | "debit",
  $id: string


}

type TransactionProps = {
  transaction: transactionListProps
}


const rightSide = () => {
  return (
    <View style={{ backgroundColor: "#FFCDD2", width: "100%", marginRight: 10, justifyContent: "center", overflow: 'hidden' }}>
      <Text style={{ fontWeight: "700", marginLeft: 20 }}>Clear</Text></View>
  )
}




const User = () => {

  const [data, setData] = useState<any[]>([])

  const [error, setError] = useState(false)


  const [loading, setLoading] = useState(true)

  const [net, setNet] = useState<number>(0)


  const clearTransaction = async ($id: string) => {

    const deleted = await appwriteClient.clearTransaction($id, collectionId)

    if (!deleted) return Alert.alert("Error Clearing Transaction ...")
    const updatedArray = data.filter(item => item.$id !== $id);
    setData(updatedArray);
    performRefresh()

  }

  const { appwriteClient, collectionId, performRefresh } = useAuthStore()
  const TransactionList = ({ transaction }: TransactionProps) => (

    <Swipeable renderLeftActions={rightSide}
      onSwipeableWillOpen={() => clearTransaction(transaction.$id)}
      containerStyle={{ marginBottom: 8 }}

    >
      <List.Item
        style={{ marginLeft: 15 }}
        title={transaction.DateTime}
        description={transaction.Description}
        left={() => <List.Icon icon="wallet" color={transaction.type == "debit" ? "red" : "green"} />} //"#FFCDD2"
        right={() => <Text style={[{ alignSelf: 'center', fontWeight: "bold", fontSize: 17 }, { color: transaction.type === "debit" ? 'red' : 'green' }]}> ₹ {transaction.Amount}</Text>}
      // right={props => <View style={{flex:1 , flexDirection:"column"}}><Text style={{color:'red'}}>24</Text><Text style={{color:'red'}}>24 March</Text> </View>}

      />
      <Divider />
    </Swipeable>
  )



  const userId = useLocalSearchParams<{ userId: string, userName: string }>()
  useEffect(() => {
    // console.log("Execitong userid")
    // console.log("CollectionId is ::: ", collectionId)
    async function iffy() {
      const dbData = await appwriteClient.getUserTransactions(collectionId, userId.userName)

      if (!dbData) setError(true)

      else setData(dbData)

      setLoading(false)

    }

    iffy()

  }, [])



  useEffect(() => {
    setNet(0)
    let sumDebit:number=0;
    let sumCredit:number=0;
    data.map((transaction => (
      transaction.type=="credit"?sumCredit+=transaction.Amount : sumDebit+=transaction.Amount
    )))
    // console.log("credit ::" ,sumCredit)
    // console.log("sumDebit :: " , sumDebit)
    setNet(sumCredit-sumDebit)
  }, [data])

  return (


    <View style={{flex:1}}>
      <Stack.Screen options={{
        headerTitle: userId.userName,
        headerTitleAlign: "center",
        statusBarStyle: "dark",
        animation: "fade_from_bottom",
        headerRight: () => <Text style={{ fontWeight: "bold", fontSize: 18, color: net > 0 ? "green" : "red" }}>{net}</Text>
      }} />

      {loading && <View style={{flex:1 , marginTop:200}}>
        <ActivityIndicator size={100} color={'gray'} />
        </View>}

      {error && <View><Text>Error occurred</Text></View>}



      {!loading && !error && data.length>0 &&

          <FlashList
            data={data}
            renderItem={({ item }) => <TransactionList transaction={{ DateTime: item.DateTime, Description: item.Description, type: item.type, Amount: item.Amount, $id: item.$id }} />}
            keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
            estimatedItemSize={86}
          />}





    </View>
  )
}

export default User