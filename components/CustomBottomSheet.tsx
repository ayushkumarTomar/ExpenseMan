import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import {forwardRef, useMemo, useRef, useState } from 'react';

import SnackBar , {SnackBarMethods} from './SnackBar';
import { StyleSheet, Text } from 'react-native';
import { SegmentedButtons, Button } from 'react-native-paper';


type Props = {
    title: string
}

type Ref = BottomSheet



const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
    const snapPoints = useMemo(() => ['50%', '100%'], []);
    const [amount, setAmount] = useState<string>('')
    const [type, setType] = useState<"credit" | "debit">("debit")
    const [descript, setDescription] = useState<string>("")


    const snackBarRef = useRef<SnackBarMethods>(null)

    const [error , setError] = useState<string>("")


    const addAmount = () => {
        // console.log(props)
        if(!amount) return setError("Enter Amount please! .") 
        
        // console.log(amount)
        // console.log("------> ", type)
        // console.log("==========> ", descript)
    }


    return (
        <BottomSheet snapPoints={snapPoints} enablePanDownToClose={true} ref={ref} index={-1}>
            <BottomSheetView style={styles.contentContainer}>

                <BottomSheetView style={{ flexDirection: 'row', padding: 20, alignItems: "flex-start" }}>

                    <Text style={{ alignSelf: "center", fontWeight: "700", marginHorizontal: 20, fontSize: 17 }}>Enter Amount </Text>

                    <BottomSheetTextInput placeholder='amount' style={{ paddingHorizontal: 20, paddingVertical: 4, borderRadius: 15, borderColor: "black", borderWidth: 2, textAlign: 'center', fontSize: 14, fontWeight: "500" }}
                        onChangeText={(text) => setAmount(text)}
                        value={amount}
                    />


                </BottomSheetView>
                <BottomSheetView style={{ flexDirection: 'row', padding: 20, alignItems: "flex-start" }}>

                    <Text style={{ alignSelf: "center", fontWeight: "700", marginHorizontal: 20, fontSize: 17 }}>Description</Text>


                    <BottomSheetTextInput placeholder='Descripton' style={{ maxWidth: "50%", paddingHorizontal: 20, paddingVertical: 4, borderRadius: 15, borderColor: "black", borderWidth: 2, textAlign: 'center', fontSize: 14, fontWeight: "500" }}
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
                <Button icon="cart-plus" mode="contained" style={{ marginTop: 50 }} onPress={addAmount}>
                    Add
                </Button>
            </BottomSheetView>

        <SnackBar ref = {snackBarRef} title = {error}></SnackBar>
        </BottomSheet>
    );


})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center'
    },
    containerHeadline: {
        fontSize: 24,
        fontWeight: '600',
        padding: 20
    }
});

export default CustomBottomSheet