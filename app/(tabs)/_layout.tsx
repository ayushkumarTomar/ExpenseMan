import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Redirect, withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import useAuthStore from "../state/authState";
import { Alert  , BackHandler, View , Text} from "react-native";
import { useEffect } from "react";
import IndexSkeletonPlaceholder from "@/components/indexPlaceHolder";


const { Navigator } = createMaterialTopTabNavigator();

type CollectionData = {
  [username: string]: string;
};


export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);


export default function TabLayout() {

  const {isLoggedIn , loading , networkState , user , setCollectionId } = useAuthStore()
  

  useEffect(()=>{
    if(isLoggedIn){

      
      const fetchId = ()=>{
        const username = user?.name ? user?.name: "" 
    
        fetch("https://raw.githubusercontent.com/UnworthyCoder/transactionsNative/main/collections.json")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json() as Promise<CollectionData>; // Specify the expected data type as CollectionData
      })
      .then((data: CollectionData) => {
    
       
        // Assuming 'data' is an object where keys are usernames and values are collection IDs
        const usernameExists = data.hasOwnProperty(username);
        // console.log("username exists :: " , usernameExists)
    
        if (usernameExists) {
          // If username exists, setCollectionId with the corresponding collection ID
          setCollectionId(data[username]);

          // console.log(data[username])
        } else {
          // If username does not exist, set collectionId to empty string
          setCollectionId("");
        }
      })
      }

      fetchId()
      
    }
  } , [isLoggedIn])

  

  if(!networkState) {
    return Alert.alert('Network Error', 'You are not connected to internet', [
      {
        text: 'Okay',
        onPress: () =>  BackHandler.exitApp() ,
        style: 'cancel',
      }]);
      


  }
  if(loading){
    return (
      <IndexSkeletonPlaceholder />
    )
  }
  if(!isLoggedIn)

  return <Redirect href = '/(auth)/signIn'/>


  

  return (

    <MaterialTopTabs screenOptions={{
      tabBarIndicatorStyle:{backgroundColor:"gray" , borderRadius:50 , height:3} 
       ,
    }}>
      <MaterialTopTabs.Screen name="index" options={{ title: "Current" }} />
      <MaterialTopTabs.Screen name="two" options={{ title: "History" }} />
    </MaterialTopTabs>
    // <Tabs screenOptions={{
    //   headerShown:false
    //   // tabBarIndicatorStyle:{backgroundColor:"gray" , borderRadius:50 , height:3}
    // }}>
    //   <Tabs.Screen name="index" options={{ title: "Current" }} />
    //   <Tabs.Screen name="two" options={{ title: "History" }} />
    // </Tabs>
  );
}