import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const loginStack  = createStackNavigator();


export function LoginStackNavigator(){
    return(
        <loginStack.Navigator>
        <loginStack.Screen name="Main" component={MainScreen} />
        <loginStack.Screen name="Join" component={JoinScreen} options={{headerShown: false}}/>
        <loginStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
    </loginStack.Navigator>
    )
}
