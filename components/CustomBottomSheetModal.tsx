import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet , ToastAndroid } from 'react-native';
import { SegmentedButtons, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetTextInput,
    useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import useAuthStore from '@/app/state/authState';

const App = forwardRef((props: any, ref: any) => {

    const getCurrentDateTimeFormatted = useCallback(() => {
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
    }, []);

    const [amount, setAmount] = useState<string>('')
    const [type, setType] = useState<"debit" | "credit">("debit")
    const [descript, setDescription] = useState<string>("")

    const { appwriteClient, collectionId } = useAuthStore()


    // console.log("Got :: " , props)

    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
    });



    const [loading, setLoading] = useState(false)
    
    const showToast =  useCallback((prompt:string)=>{
            ToastAndroid.show(prompt, ToastAndroid.TOP);
    } , [])


    const addAmount = async () => {

        // console.log(Number(amount))
                //@ts-ignore

        if (isNaN(Number(amount))|| amount=="") {
            return showToast("Invalid amount ! .")
        }

        else {
            setLoading(true)
            const addTransaction = await appwriteClient.AddUser(collectionId, { User: props.current ? props.current : "", type, Description: descript, Amount: Number(amount), DateTime: getCurrentDateTimeFormatted() })
            setLoading(false)
            if (addTransaction) {
                return showToast("Transaction Added ")

            }

            showToast("Failed !! ..")

        }


    }
    // ref
    const bottomSheetModalRef = ref

    // variables
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

    // callbacks

    const handleSheetChanges = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);

    // renders
    return (
        <View style={styles.container}>
            

            <BottomSheetModal

                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backgroundStyle={{ backgroundColor: '#F5F5F5', borderRadius: 40 }}
                onDismiss={props.onDismiss}
                animationConfigs={animationConfigs}
            >
                <BottomSheetView style={styles.contentContainer}>
                

                    {loading && <ActivityIndicator size={27} style={{ alignSelf: 'center' }} />}
                    <Text style={{ fontWeight: 'bold', color: "blue" }}>{props.current}</Text>
                    <BottomSheetView style={{ flexDirection: 'row', padding: 20, alignItems: "flex-start" }}>

                        <Text style={{ alignSelf: "center", fontWeight: "700", marginHorizontal: 20, fontSize: 17 }}>Enter Amount </Text>

                        <BottomSheetTextInput placeholder='Amount' style={{ paddingHorizontal: 20, paddingVertical: 4, borderRadius: 15, width:120 , borderColor: "black", borderWidth: 2, textAlign: 'center', fontSize: 14, fontWeight: "500" }}
                            onChangeText={(text) => setAmount(text)}
                            value={amount}
                        />


                    </BottomSheetView>
                    <BottomSheetView style={{ flexDirection: 'row', padding: 20, alignItems: "flex-start" }}>

                        <Text style={{ alignSelf: "center", fontWeight: "700", marginHorizontal: 20, fontSize: 17 }}>Description{"      "}</Text>


                        <BottomSheetTextInput placeholder='Description' style={{ maxWidth: "50%",  width:300 ,paddingHorizontal: 20, paddingVertical: 4, borderRadius: 15, borderColor: "black", borderWidth: 2, textAlign: 'center', fontSize: 14, fontWeight: "500" }}
                            onChangeText={(text) => setDescription(text)}
                            value={descript}
                        />


                    </BottomSheetView>

                    <SegmentedButtons


                        style={{ marginHorizontal: 20, marginTop: 30 }}
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
                    <Button icon="cart-plus" mode="contained-tonal" style={{ marginTop: 50 }} onPress={addAmount}>
                        Add
                    </Button>

                   



                </BottomSheetView>
                

            </BottomSheetModal>

            
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default App;