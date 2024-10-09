import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

// navigation 

import {NavigationContainer} from "@react-navigation/native"
import { createNativeStackNavigator} from '@react-navigation/native-stack'


// screens

import Home from './screens/Home'


export type RootStackParamList = {
  Home: undefined;
  Details:{productId :string}
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name='Home'
          component={Home}
          options={{
            headerShown:false
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})