import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
      <Stack screenOptions={{
            headerTitle:"ExpenseMan" , headerTitleAlign:"center"
      }}>
        <Stack.Screen name="signIn" options={{headerShown:false}} />
        
      </Stack>
    );
  }