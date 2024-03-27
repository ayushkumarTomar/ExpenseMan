import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useAuthStore from './state/authState';
import AppwriteService from './lib/appwriteServices';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
// @ts-ignore
import UserAvatar from 'react-native-user-avatar'
import { View, Image, Text } from 'react-native';



export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const appwrite = new AppwriteService()
  const { toggleLoading, login, setNetworkState, setCollectionId } = useAuthStore()

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);



  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected) setNetworkState()
    });
    async function checkLogin() {

      const loginData = await appwrite.getCurrentUser()
      // console.log(loginData)
      if (loginData) {
        login(loginData)
      }
      toggleLoading()

    }
    checkLogin()

    return () => unsubscribe()
  }, [])
  useEffect(() => {
    async function iffy() {

      console.log("inside iffy")
      await new Promise(resolve => setTimeout(resolve, 500))
      // // setFinal(true)

      SplashScreen.hideAsync();

    }

    iffy()
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}


function RootLayoutNav() {
  const { isLoggedIn, logout, appwriteClient, loading, user } = useAuthStore()

  return (


    <GestureHandlerRootView style={{flex:1}}>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ statusBarStyle: "dark" ,
                headerTitle: () => <View style={{ flexDirection: 'row' }}>
                  <Image style={{ width: 40, aspectRatio: 1, alignSelf: 'center' }} source={require('../assets/images/headerLogo.png')} />
                  <Text style={{ fontWeight: "900", fontSize: 20, marginLeft: 1 }}>MAN</Text>
                </View>,
                headerShown: true,
                headerTitleAlign: 'center',
                headerLeft: !loading && isLoggedIn ? () => <UserAvatar name={user?.name} /> : undefined,
                headerRight: !loading && isLoggedIn ? () =>
                  <MaterialCommunityIcons
                    size={24}
                    name="logout"
                    onPress={() => {
                      appwriteClient.logout();
                      logout();
                    }}
                  />
                  : undefined
              }}>
            <Stack.Screen
              name="(tabs)"
              
            />

            <Stack.Screen name='(auth)'/>




          </Stack>

        </BottomSheetModalProvider>


    </GestureHandlerRootView>
  );

}
