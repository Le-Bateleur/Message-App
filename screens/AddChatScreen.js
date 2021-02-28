import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View, Dimensions, ImageBackground } from 'react-native'
import {Button, Icon, Input} from "react-native-elements"
import { db } from '../firebase';

export default function AddChatScreen({navigation}) {
    const [input,setInput] = useState("");
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: "Add a new chat",
        });
    },[navigation]);
    const createChat = async () => {
        await db
        .collection('chats')
        .add({
            chatName: input,
        })
        .then(()=>{navigation.goBack();})
        .catch((error)=>alert(error));
    };
    return (
        <ImageBackground style={styles.dimensions} imageStyle={styles.background} source={require("../assets/cubes.png")}>

        <View style={styles.container}>
            <Input 
            value={input} 
            onChangeText={text=>setInput(text)}
            leftIcon={
                <Icon name="wechat" type="antdesign" size={24} color="black" />
            }
            placeholder="Enter a chat name"/>
            <Button disabled={!input} onPress={createChat} title="Create new Chat" />
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container:{
        padding:30,
        height:"100%",
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
