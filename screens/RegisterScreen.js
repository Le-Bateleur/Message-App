import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Dimensions } from 'react-native'
import { Button, Input, Image, Text } from "react-native-elements";
import {StatusBar} from "expo-status-bar";
import { auth } from "../firebase";
import { ImageBackground } from 'react-native';
export default function RegisterScreen({navigation}) {

    const register = () => {
        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName: name,
                photoURL:imageUrl || "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg",
            })
        })
        .catch((error)=>alert(error.message))
    };
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [imageUrl,setImageUrl] = useState("");
    // For IOS
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to Login",
        });
    },[navigation]);
    //
    return (
        <ImageBackground style={styles.dimensions} imageStyle={styles.background} source={require("../assets/cubes.png")}>

        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light"/>
            <Text h3 style={{marginBottom:50}}>Create an account</Text>
            <View style={styles.inputContainer}>
                <Input placeholder="Full Name" autoFocus type="text" value={name} onChangeText={text => setName(text)}/>
                <Input placeholder="Email" type="text" value={email} onChangeText={text => setEmail(text)}/>
                <Input placeholder="Password" type="text" value={password} secureTextEntry onChangeText={text => setPassword(text)}/>
                <Input placeholder="Profile Picture URL (optional)" type="text" value={imageUrl} onChangeText={text => setImageUrl(text)}/>

            </View>
            <Button containerStyle={styles.button} raised onPress={register} title="Register" />
        </KeyboardAvoidingView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:"center",
        justifyContent:"center",
        padding:10,
    },
    inputContainer:{
        width: 300,
    },
    button: {
        width:200,
        marginTop:10,
    },
    background: {
        flex: 1,
        height:"100%",
        width:"100%",
        position:"absolute",
        tintColor:"darkgrey",
        resizeMode:"repeat",
    },
    dimensions: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },

})
