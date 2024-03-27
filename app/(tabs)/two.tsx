import { View, Text, StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import { FlashList } from "@shopify/flash-list";

import { useState } from 'react';
import HistoryUser from '@/components/HistoryUser';

import useAuthStore from '../state/authState';

import IndexSkeletonPlaceholder from '@/components/indexPlaceHolder';
import { Divider } from 'react-native-paper';

type UserData = string[]



const Index = () => {
  const [loading, setLoading] = useState(true)

  const { appwriteClient , collectionId , refresh } = useAuthStore()

  const [data, setData] = useState<UserData>([])

  const [error , setError] = useState("")

  useEffect(() => {

    async function iffy(){

    if (collectionId) {
      const userData = await appwriteClient.getCurrent(collectionId ,true)
      if(!userData) {

        setError("Error") 
      }
      else{
        setData(userData)
      }
    setLoading(false)

    }
  }
  iffy()




  }, [collectionId , refresh ])




  if(error){
    return (
      <View style={{flex:1}}>
        <Text style={{fontSize:20 , fontWeight:"bold" , alignSelf:'center' , marginTop:200}}>Error Loading your data</Text>
        <Text style={{fontSize:13 , fontWeight:"400" , color:"gray" , alignSelf:'center'}}>Please Contact Developer</Text>
      </View>
    )
  }

  if(loading){
    return (
      <IndexSkeletonPlaceholder />
    )
  }

  // console.log(data)

  return (
    <View style={styles.container}  >

      <View style={{ flex: 1, width: "100%", marginTop: 5, }}>
        <Divider />
        <FlashList 
          data={data}
          renderItem={({ item }) => <HistoryUser userData={{ title :item}} />}
          keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
          estimatedItemSize={39}
        />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor:'white'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
     // Translucent background color for modal

  },
  modalView: {
    margin: 20,
    width:'70%' ,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});


export default Index