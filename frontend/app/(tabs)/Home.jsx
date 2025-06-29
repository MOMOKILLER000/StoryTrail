import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {useRouter} from "expo-router";

const Home = () => {

    const router = useRouter();
  return (
    <View>
      <Text>Home</Text>
        <Pressable
            onPress={()=>{router.push('/Profile')}}
        >
            <Text>
                Profile page
            </Text>
        </Pressable>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});