import { Button, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

// navigation

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

// mentioning native stack screen props home so that it knows it for home
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

import {MagnifyingGlassIcon} from "react-native-heroicons/outline"

// the navigation arguement come by default since it a stack of screens
const Home = ({navigation}:HomeProps) => {
  return (
	<View style={styles.container}>

		<StatusBar barStyle={"light-content"} />
		<Image
		style={styles.bgImage}
		blurRadius={30}
		source={require("../assets/img/bg.jpg")}
		/>
		<SafeAreaView
			style={styles.searchContainer}
		>
			{/* search section */}
			<View
				style={styles.searchBar} 
			>
				<View style={{
					flex:1,
					flexDirection:"row",
					justifyContent:"flex-end",
					alignItems:"center",
					borderRadius:100,
					backgroundColor:"rgba(255,255,255,0.2)"
				}}>
					<TextInput
						placeholder='Search place'
						placeholderTextColor={"black"}
						style={{
							paddingLeft:4,
							marginLeft:20,
							width:"80%",
						}}
					/>
					<TouchableOpacity
						style={{
							borderRadius:100,
							backgroundColor:"rgba(255,255,255,0.2)",
							padding:15
						}}
					>
						<MagnifyingGlassIcon size="25" color="white"/>
					</TouchableOpacity>
				</View>

			</View>
		</SafeAreaView>
		
	</View>
  )
}

export default Home

const styles = StyleSheet.create({
	container:{
		flex:1,
		position:"relative",
		height:"100%",
	},
	smallText:{
		color:"#000000"
	},
	bgImage:{
		height:'100%',
		width:"100%",
		position:"absolute"
	},
	searchContainer:{
		flex:1,
	},
	searchBar:{
		height:60, 
		margin:10 ,
		position:"relative", 
		zIndex:50
	}
})