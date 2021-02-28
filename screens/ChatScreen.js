import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity,ScrollView, Dimensions} from 'react-native'
import { Avatar } from 'react-native-elements'
import {FontAwesome,Ionicons} from "@expo/vector-icons"
import { KeyboardAvoidingView, Platform, Keyboard  } from 'react-native'
import { db, auth, firebase } from '../firebase'
import { ImageBackground } from 'react-native'


export default function ChatScreen({navigation,route}) {
    const [input,setInput] = useState("");
    const [messages,setMessages] = useState([]);
    useLayoutEffect(()=>{
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible:false,
            headerTitleAlign:"left",
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems:"center",
                }}>
                    <Avatar rounded source={{uri: messages[messages.length-1]?.data.photoURL || "https://cdn2.iconfinder.com/data/icons/avatar-profile/449/avatar_user_default_contact_profile_male-512.png"}}/>
                    <Text style={{fontWeight:"700",marginLeft:20}}

                    >{route.params.chatName}</Text>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection:"row",
                    justifyContent:"space-between",
                    width: 80,
                    marginRight:20}}>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ), 
        });
    },[navigation,messages]);
    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection("chats").doc(route.params.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })
        setInput("");
    };
    useLayoutEffect(()=>{
        const unsubscribed = db
        .collection("chats")
        .doc(route.params.id)
        .collection("messages")
        .orderBy("timestamp","asc")
        .onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
        ));
    });
    return (
        <ImageBackground style={styles.dimensions} imageStyle={styles.background} source={require("../assets/cubes.png")}>

        <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={90}
            >
            
            <ScrollView contentContainerStyle={{paddingTop:15}}>
                {messages.map(({id, data}) => (
                    data.email === auth.currentUser.email ? (
                        <View key={id} style={styles.receiver}>
                            <Avatar rounded bottom={-15} right={-5} size={30} source={{uri:data.photoURL}} containerStyle={styles.receiverAvatar}/>
                            <Text style={styles.receiverText}>{data.message}</Text>
                        </View>
                    ) : (
                        <View key={id} style={styles.sender}>
                            <Avatar rounded bottom={-15} left={-5} size={30} source={{uri:data.photoURL}} containerStyle={styles.senderAvatar}/>
                            <Text style={styles.senderText}>{data.message}</Text>
                            <Text style={styles.senderName}>{data.displayName}</Text>
                        </View>
                    )
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <TextInput value={input} placeholder="Message" style={styles.textInput} onChangeText={text => setInput(text)}/>
                <TouchableOpacity activeOpacity={0.5} onPress={sendMessage} >
                <Ionicons name="send" size={24} color="#0D8DFD" />
                </TouchableOpacity>
            </View>

            </KeyboardAvoidingView>
            
        </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    footer:{
        flexDirection:"row",
        alignItems:"center",
        width: "100%",
        padding: 15,
    },
    textInput:{
        bottom:0,
        height:40,
        flex: 1,
        marginRight: 15,
        borderWidth: 1,
        borderColor:"transparent",
        padding: 10,
        color:"grey",
        borderRadius:30,
    },
    receiver: {
        padding: 15,
        alignSelf: "flex-end",
        backgroundColor:"#ECECEC",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative",
    },
    sender:{
        padding: 15,
        alignSelf: "flex-start",
        backgroundColor:"#0D8DFD",
        borderRadius: 20,
        marginLeft:15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative"
    },
    senderName:{
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white",
    },
    receiverText:{
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15,
    },
    senderText: {
        fontWeight: "500",
        marginRight: 10,
        marginBottom: 15,
    },
    receiverAvatar:{
        position: "absolute",
        bottom: -15,
        right: -5,
    },
    senderAvatar:{
        position:"absolute",
        bottom: -15,
        left: -5,
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
