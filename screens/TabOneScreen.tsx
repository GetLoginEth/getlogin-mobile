import { Dimensions, ImageBackground, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Ionicons } from '@expo/vector-icons';
import balanceBack from '../assets/images/wallet-back.png';

export default function TabOneScreen({}: RootTabScreenProps<'TabOne'>) {
    const balances = {
        xdai: '9999.999999999999999999',
        xbzz: '9999.9999999999999999'
    };

    const prepareBalance = (balance: string) => {
        const split = balance.split('.')
        if (split.length === 2 && split[1].length > 2) {
            return `${split[0]}.${split[1].substr(0, 2)}`;
        } else {
            return balance;
        }
    }
    return (
        <View style={styles.container}>
            {/*<Text style={styles.title}>Tab One</Text>*/}
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>

            <View style={styles.balanceContainer}>
                <ImageBackground source={balanceBack}
                                 imageStyle={{borderRadius: 16}}
                                 resizeMode='cover'
                                 style={styles.balanceBack}>
                    <Text style={styles.balanceText}>{prepareBalance(balances.xdai)} xDai</Text>
                    <Text style={styles.balanceTextSmall}>{prepareBalance(balances.xbzz)} xBzz</Text>
                </ImageBackground>
            </View>

            <View style={styles.walletButtonsHolder}>
                <View style={styles.walletButton}>
                    <Ionicons style={styles.walletIcon} name="arrow-down-circle-outline" size={60} color="black"/>
                    <Text style={styles.walletButtonTitle}>Receive</Text>
                </View>
                <View style={styles.walletButton}>
                    <Ionicons style={styles.walletIcon} name="arrow-up-circle-outline" size={60} color="black"/>
                    <Text style={styles.walletButtonTitle}>Send</Text>
                </View>
            </View>
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
    balanceContainer: {
        // width:'100%',
        flex: 1,
        flexDirection: 'column'
    },
    balanceText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 40
    },
    balanceTextSmall: {
        marginLeft: 10,
        color: 'white',
        fontSize: 30
    },
    balanceBack: {
        // flex: 1,
        justifyContent: 'center',
        // textAlignVertical:'center',
        // alignItems:'center',
        width: Dimensions.get('window').width * 0.9,
        height: 180,
        padding: 10
    },
    walletButtonsHolder: {
        marginTop: 20,
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    walletButtonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    walletIcon: {
        textAlign: 'center'
    },
    walletButton: {
        padding: 8,
        marginLeft: 5,
        marginRight: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d7d7d7',
        borderRadius: 16,
        width: 150,
        height: 120,
    },
    // balanceCard:{
    //     // backgroundColor:'yellow',
    //     padding: 8,
    //     marginLeft: 5,
    //     marginRight: 5,
    //     borderStyle: 'solid',
    //     borderWidth: 1,
    //     borderColor: '#d7d7d7',
    //     borderRadius: 16,
    //     width: '90%',
    //     height: 150,
    // }
});
