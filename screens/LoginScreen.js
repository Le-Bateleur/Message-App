import React, {useState, useEffect} from "react"
import { StyleSheet, Text, View, KeyboardAvoidingView, ImageBackground, Dimensions} from "react-native"
import { Button, Input, Image } from "react-native-elements";
import {StatusBar} from "expo-status-bar";
import {auth } from "../firebase";
import { Platform } from "react-native";

export default function LoginScreen({navigation}) {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    useEffect (()=>{
        const unsubscribed = auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                navigation.replace("Home");
            }
        });
        return unsubscribed;
    },[]);
    const signIn = () => {
        auth.signInWithEmailAndPassword(email,password)
        .catch((error)=>alert(error))
    };
    return (
        
        <ImageBackground style={styles.dimensions} imageStyle={styles.background} source={require("../assets/cubes.png")}>
        
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
        
        
        <StatusBar style="light" />
        
            <Image source={{uri:"https://icons-for-free.com/iconfiles/png/512/comments+inbox+message+icon-1320195968215707585.png"}} style={{width: 200, height:200}}/>
            <View style={styles.inputContainer}>
                <Input placeholder="Email" autoFocus type="Email" value={email} onChangeText={text => setEmail(text)}/>
                <Input placeholder="Password" secureTextEntry type="password" value={password} onChangeText={text => setPassword(text)}/>
            </View>
            <Button containerStyle={styles.button} onPress={signIn} title="Login"/>
            <Button containerStyle={styles.button} onPress={() => navigation.navigate("Register")} type="outline" title="Register" />
            
        
        </KeyboardAvoidingView>
        
        </ImageBackground>
       
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    inputContainer: {
        width:300,
    },
    button: {
        width:200,
        marginTop:10,
        marginBottom:10,
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
