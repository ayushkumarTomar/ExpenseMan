import 'react-native-gesture-handler';
import React, {useCallback } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
 

import { Link, router } from 'expo-router';

import { Divider} from 'react-native-paper';


// @ts-ignore
import UserAvatar from 'react-native-user-avatar'


type user2 = {id: number,
  label: string,
  title: string,
  description: string | null | undefined}
type User = {
  id: number,
  label: string,
  title: string,
  description: string | null | undefined,
  handleSwipe: (user:user2) => void
}
type UserProps = {
  userData: User;
}

export default function App({userData}: UserProps) {
  const offset = useSharedValue(0);

  const handleSwipe = useCallback(() => {
    // console.log("Swipping :: " , userData.title)
    userData.handleSwipe?.({id:Number(userData.title) ,label:userData.label , title:userData.title , description: userData.description });

  } , []) 


  const pan = Gesture.Pan()
    .onBegin(() => {
    })
    .onChange((event) => {
      // console.log(event)
      if (event.velocityX > 0) {
        offset.value = event.translationX;
      }
      if(event.velocityX<0 && Math.abs(event.changeY)<0.1){
        // console.log(event)
        // console.log("-------------------------------------------------------------changing route! !")
        runOnJS(router.navigate)("/two")
      }
    })
    .onEnd((event) => {
      // console.log(event.translationY)
      if (event.translationX>150 && event.translationY<100) runOnJS(handleSwipe)()
        // if(event.translationX>150 && event)      
    })
    .onFinalize(() => {


      offset.value = withSpring(0);
      // console.log("ended")

    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
    ],
  }));

  return (
    
      <View style={styles.container}>
        <GestureDetector gesture={pan}>
          <Animated.View style={{ backgroundColor: "lightgreen" , width:"100%" ,marginRight:10 , height:50, justifyContent: "center" , overflow:'hidden'}}>
            <Text style={{ fontWeight: "700" , marginLeft:20 }}>Add</Text>
            <Animated.View style={[{ backgroundColor: "white", width: "100%", height: "100%", position: 'absolute' , flexDirection:'row' , justifyContent:"flex-start" , padding:10}, animatedStyles]}>

            <UserAvatar size={30} name={userData.label} />
            <Link href={{ pathname: "/User/[userId]", params: { userId: userData.title, userName: userData.title } }} asChild>
                <Text style={{ flex: 1, alignSelf: 'center', marginStart: 20, fontWeight: "700", fontSize: 17 }}>{userData.title}</Text>
              </Link>

            </Animated.View>
            
          </Animated.View>
          



        </GestureDetector>

        {/* <View style={{flex:1 , width:"100%"}}>

          <TouchableOpacity style={{width:"100%" , borderRadius:0 , borderWidth:0.2}}></TouchableOpacity>
          
        </View> */}


      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: "100%"
  }
});

