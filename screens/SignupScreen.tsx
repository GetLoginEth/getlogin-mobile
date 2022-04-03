import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useAppDispatch } from '../redux/hooks';
import { setIsLogged } from '../redux/app/appSlice';

export default function SignupScreen() {
    const dispatch = useAppDispatch();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up screen</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <Text
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Hello world
            </Text>

            <TouchableOpacity onPress={() => {
                dispatch(setIsLogged(true))
            }} >
                <Text >Login fake!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
