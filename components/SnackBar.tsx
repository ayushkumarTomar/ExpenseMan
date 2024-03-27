import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View} from 'react-native';
import { Snackbar } from 'react-native-paper';



interface SnackBarProps {
  title:string
}

export interface SnackBarMethods {
  toggleSnackBar: () => void;
}

const SnackBar = forwardRef<SnackBarMethods, SnackBarProps>((props, ref) =>  {
  const [visible, setVisible] = useState(false);

  // Function to toggle Snackbar visibility
  const toggleSnackBar = () => {
    setVisible((prevState) => !prevState);
    
  };

  // Expose toggle function via ref
  useImperativeHandle(ref, () => ({
    toggleSnackBar: toggleSnackBar,
  }));

  // Function to dismiss Snackbar
  const dismissSnackBar = () => {
    setVisible(false);
  };

  return (
    <View style={{flex:1 }}>
      <Snackbar style={{borderRadius:40 , backgroundColor:'#FF474C'}}
        visible={visible}
        onDismiss={dismissSnackBar}
        duration={1000}
        >
        {props.title}
      </Snackbar>
    </View>
  );
});

export default SnackBar;
