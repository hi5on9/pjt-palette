import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const ResultStack = createStackNavigator();

export function ResultStackNavigator(){
    return(
        <ResultStack.Navigator>
        <ResultStack.Screen name="Result" component={ResultScreen} options={{headerShown: false}}/>
    </ResultStack.Navigator>
    )
}