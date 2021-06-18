import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const userStack  = createStackNavigator();


export function UserStackNavigator(){
    return(
    <userStack.Navigator>
        <userStack.Screen name="Main" component={MainScreen} />
        <userStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <userStack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
    </userStack.Navigator>
    )
}
