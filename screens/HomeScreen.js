import React, {useEffect, useLayoutEffect, useState}from 'react'
import {ScrollView, SafeAreaView,StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native'
import { Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomListItem from "../components/CustomListItem"
import {auth,db} from "../firebase"
import {AntDesign,SimpleLineIcons} from "@expo/vector-icons"

export default function HomeScreen({navigation}) {
    const [chats,setChats] = useState([]);
    const signOutUser = () => {
        auth.signOut().then(()=>{
            navigation.replace("Login");
        });
    };

    useEffect(()=>{
        const unsubscribe = db.collection("chats").onSnapshot(snapshot=>(
            setChats(snapshot.docs.map(doc=>({
                id: doc.id,
                data: doc.data()
            })))));
        return unsubscribe;
    },[]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title:"Message",
            headerLeft: () => (
            <View style={{marginLeft:20}}>
                <TouchableOpacity  activeOpacity={0.5}>
                <Avatar onPress={signOutUser} rounded source={{uri: auth?.currentUser?.photoURL }} />
                </TouchableOpacity>
            </View>),
            headerRight: () => (
                <View style={{
                    flexDirection:"row",
                    justifyContent:"space-between",
                    width: 80,
                    marginRight:20}}>
                <TouchableOpacity activeOpacity={0.5}>
                <AntDesign name="camerao" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity  activeOpacity={0.5}>
                <SimpleLineIcons onPress={()=>navigation.navigate("AddChat")} name="pencil" size={24} color="white" />
                </TouchableOpacity>
                </View>),
        });
    }, [navigation]);

    const enterChat = (id,chatName) => {
        navigation.navigate("Chat",{
            id,
            chatName,
        });
    };
    return (
        <ImageBackground style={styles.dimensions} imageStyle={styles.background} source={require("../assets/cubes.png")}>

        <SafeAreaView>
            <ScrollView style={styles.container}>
                { chats.map( ({ id, data: { chatName } }) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
                ))}
            </ScrollView>
        </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
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
