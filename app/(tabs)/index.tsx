import { View, Text, StyleSheet, Modal , Alert , ToastAndroid  } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import Animated , {BounceInRight} from 'react-native-reanimated';
import React, { useEffect, useRef } from 'react'
import { useState, useCallback } from 'react';
import {FAB , TextInput ,Button , SegmentedButtons } from 'react-native-paper';
import User from '@/components/User';
import CustomBottomSheetModal from '@/components/CustomBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import useAuthStore from '../state/authState';

import IndexSkeletonPlaceholder from '@/components/indexPlaceHolder';

type UserData = string[]



const Index = () => {
  const showToast =  useCallback((prompt:string)=>{
    ToastAndroid.show(prompt, ToastAndroid.TOP);
} , [])
  

  const getCurrentDateTimeFormatted = useCallback(()=> {
    const months = [
      'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 
      'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];
  
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const meridian = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  
    return `${day} ${month} ${formattedHours}:${minutes} ${meridian}`;
  } , []);
  
  const AddModal = ()=>{

    const [newUser , setNewUser] = useState<string>("")

    const [Amount , setAmount] = useState("")

    const [Description , setDescription] = useState("")

    const [type , setType] = useState<"debit"|"credit">("debit")

    const handleNewUser = async()=>{
      if(newUser != "") {
        //@ts-ignore
        if (isNaN(Number(Amount))|| Amount=="") {
          // console.log("Enter correct Amount")
          showToast("Invalid amount ")

        }

        else{

            const created = await appwriteClient.AddUser(collectionId , { User:newUser , type , Description ,Amount : Number(Amount) , DateTime : getCurrentDateTimeFormatted()})            
            // console.log("created :: " ,created)
            if(created) {
              setShowModal(false)
              showToast("New User created")
              performRefresh()
            }
            else showToast("Error creating user !!")
          }
        
      
      }

      else showToast("Enter new user!! .")

    }
    return (<Modal
    animationType="fade"
    transparent={true}
    visible={showModal}
    onRequestClose={() => {
      setShowModal(!showModal);
    }}>
    <View style={styles.centeredView} >
      <Animated.View style={styles.modalView} entering={BounceInRight}>
      <TextInput
      style={{borderRadius:40 , marginBottom:20 , width:"100%"}}
      label="Username"
      placeholder=''
      mode='outlined'
      value={newUser}
      onChangeText={text => setNewUser(text)}
    />
    <TextInput
      style={{borderRadius:40 , marginBottom:20 , width:"100%"}}
      label="Description"
      mode='outlined'
      value={Description}
      onChangeText={text => setDescription(text)}
    />
    <TextInput
      style={{borderRadius:40 , marginBottom:20 , width:"100%"}}
      label="Amount"
      mode='outlined'
      value={Amount}
      onChangeText={text => setAmount(text)}
    />
    <SegmentedButtons
        style={{ marginHorizontal: 20, marginTop: 20 , marginBottom:20 }}
        value={type}
        //@ts-ignore
        onValueChange={setType}

        buttons={[
            {

                value: 'debit',
                label: 'Debit',
                icon: "bank-minus"
            },
            {
                value: 'credit',
                label: 'Credit',
                icon: "bank-plus"
            },
        ]}
        />

        <Text style={{marginBottom:20 , fontWeight:"700"}}>{getCurrentDateTimeFormatted()}</Text>
        <Button icon="account-plus-outline" mode="contained" onPress={handleNewUser}>
        Add 
      </Button>


      
      </Animated.View>
    </View>
  </Modal>)
  }

  const [loading, setLoading] = useState(true)

  const { appwriteClient , collectionId , refresh , performRefresh } = useAuthStore()

  const [data, setData] = useState<UserData>([])

  const [error , setError] = useState("")

  const [showModal , setShowModal] = useState<boolean>(false)



  useEffect(() => {

    async function iffy(){

    if (collectionId) {
      
      const userData = await appwriteClient.getCurrent(collectionId)
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




  }, [collectionId , refresh])



  const [current, setCurrent] = useState<string>()


  const handleSwipe = useCallback((user: string) => {
    // console.log('Item swiped:', user);

    setCurrent(user)
    handlePresentModalPress()



  }, []);


  const onDismss = useCallback(() => {
    ref.current?.close()
  }, [])

  const handlePresentModalPress = useCallback(() => {
    ref.current?.present();
  }, []);


  const ref = useRef<BottomSheetModal>(null)


  if(error){
    return (
      <View style={{flex:1}}>
        <Text style={{fontSize:20 , fontWeight:"bold" , alignSelf:'center' , marginTop:200}}>Error Loading your data</Text>
        <Text style={{fontSize:13 , fontWeight:"400" , color:"gray" , alignSelf:'center'}}>Please Contact Developer</Text>
      </View>
    )
  }

  // if(loading) return <View style={{flex:1}}><ActivityIndicator size = {"large"}/></View>


  if(loading){
    return (
      <IndexSkeletonPlaceholder />
      // <Text>Loading data inside index</Text>
    )
  }

  // console.log(data)

  return (
    <View style={styles.container}  >

      <View style={{ flex: 1, width: "100%", marginTop: 5, }}>
        <FlashList
          data={data}
          renderItem={({ item }) => <User userData={{ title :item , handleSwipe: handleSwipe }} />}
          keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
          estimatedItemSize={47}

        />
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        variant='surface'
        rippleColor={"blue"}
        onPress={() => setShowModal((prev)=> !showModal)
        }
      />

          

      <Animated.View style={{ flex: 1, maxHeight: "0.1%" }}>
        <CustomBottomSheetModal ref={ref} onDismiss={onDismss} current={current} />
      </Animated.View>

        {/* <Text>haha this is blur</Text> */}
                  <AddModal/>
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
