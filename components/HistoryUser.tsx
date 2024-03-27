import 'react-native-gesture-handler';
import { StyleSheet, View, Text} from 'react-native';


import { Link} from 'expo-router';
import { Divider } from 'react-native-paper';

// @ts-ignore
import UserAvatar from 'react-native-user-avatar'



type User = {

  title:string ,
}
type UserProps = {
  userData: User;
}




export default function HistoryUser({ userData }: UserProps) {

   console.log("Got data in user :: " , userData)



  return (


    <View>
    <View style={styles.container}>

      <View style={{flexDirection:'row' , justifyContent:"flex-start"}}>

        <UserAvatar size={30} name={userData.title} />
        <Link href={{ pathname: "/User/cleared/[userId]", params: { userId: userData.title, userName: userData.title } }} asChild>
          <Text style={{ flex: 1, alignSelf: 'center', marginStart: 20, fontWeight: "700", fontSize: 17 }}>{userData.title}</Text>
        </Link>
        
        <Divider/>


      </View>
      
    </View>
    <Divider />
</View>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: "100%" ,
    marginBottom:10 ,
    marginTop:10
  }
});

