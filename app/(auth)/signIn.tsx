import { Stack, router } from 'expo-router'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { ActivityIndicator, Button, Snackbar, TextInput } from 'react-native-paper'
import useAuthStore from '../state/authState'

const SignIn = () => {

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState('')
  const [secure , setSecure] = useState(true)
  const [error , setError] = useState("")


  const {appwriteClient , login} = useAuthStore()

  const [loading , setLoading] = useState(false)

  
  const loginFunc =async()=>{

    setLoading(true)


    // console.log("Sending :: " , email , "   :::  ",password)

    const loginData = await appwriteClient.login({email , password})



    const currentUser = await appwriteClient.getCurrentUser()


    setLoading(false)

    if(!loginData){
      setError("Inavlid Password !! .")
      // showSnackBar()
    }

    else{
      if(currentUser){
      login(currentUser)
      router.replace("/(tabs)")}
      else{
        setError("Error fetching your details ...")
      }
    }


  }
  return (
    <View style={{flex:1 , justifyContent:"center" , padding:20 , flexDirection:'column'}}>
            <Stack.Screen options={{
            headerBackButtonMenuEnabled:false,
            headerBackVisible:false ,
            headerTitleAlign:"center" ,
            headerBackTitleVisible:false
            }}/>


      {loading && <ActivityIndicator style={{alignSelf:'center'}} size={30}/>}

      <Text style={{alignSelf:'center' , fontSize:24 , fontWeight:'800' , margin:30}}>Sign In</Text>
      <View style={{flex:1}}>
      <TextInput
      style={{borderRadius:40 , marginBottom:20 ,}}
      label="Email"
      mode='outlined'
      value={email}
      onChangeText={text => setEmail(text)}
    />
    <TextInput
   
      label="Password"
      mode='outlined'
      secureTextEntry={secure}
      value={password}
      onChangeText={(text)=>setPassword(text)}
      
      right={secure?<TextInput.Icon icon="eye"  onPress={()=>setSecure((false))}/> : <TextInput.Icon icon="eye-off"  onPress={()=>setSecure((true))}/>}
    />
    </View>
    <Button icon="camera" mode="contained" onPress={loginFunc}>
          Login
  </Button>

  {error &&  <View style={{alignContent:'center' , justifyContent:'center'}}><Snackbar
        visible={true}
        onDismiss={()=>setError("")}
        duration={2000}
        style={{alignSelf:'center'}}
        rippleColor={"red"}
       >
        {error}
      </Snackbar>
      </View>}
      
    </View>
  )
}

export default SignIn