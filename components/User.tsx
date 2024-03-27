import 'react-native-gesture-handler';
import React, {useCallback, useRef } from 'react';
import { StyleSheet, View, Text , Dimensions} from 'react-native';


import { Link } from 'expo-router';


// @ts-ignore
import UserAvatar from 'react-native-user-avatar'
import { Swipeable } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';


type User = {

  title:string ,
  
  handleSwipe: (user: string) => void
}
type UserProps = {
  userData: User;
}

const rightSide = () => {
  return (
    <View style={{ backgroundColor: "lightgreen", width: "100%", marginRight: 10, justifyContent: "center", overflow: 'hidden' }}>
      <Text style={{ fontWeight: "700", marginLeft: 20 }}>Add</Text></View>
  )
}



export default function App({ userData }: UserProps) {

  //  console.log("Got data in user :: " , userData)



  const handleSwipe = useCallback(async() => {
    ref.current?.reset()
    await new Promise(resolve => setTimeout(resolve, 100))

    // console.log("Swipping :: ", userData.title)
    userData.handleSwipe?.(userData.title);

  }, [])

  const ref = useRef<Swipeable>(null)


  return (


    <Swipeable renderLeftActions={rightSide}
    containerStyle={{marginBottom:25}}
    // friction={2}
    onSwipeableOpenStartDrag={(direction)=>{
      if(direction=="left") runOnJS(handleSwipe)()
    }}
    ref={ref}

    leftThreshold={Dimensions.get('window').width}
    dragOffsetFromRightEdge={Number.MAX_VALUE} >

    <View style={styles.container}>

      <View style={{flexDirection:'row' , justifyContent:"flex-start"}}>

        <UserAvatar size={30} name={userData.title} />
        <Link href={{ pathname: "/User/[userId]", params: { userId: userData.title, userName: userData.title } }} asChild>
          <Text style={{ flex: 1, alignSelf: 'center', marginStart: 20, fontWeight: "700", fontSize: 17 }}>{userData.title}</Text>
        </Link>

      </View>
    </View>

    </Swipeable>





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

