import * as React from 'react';
import config from '../config';
import { View, StyleSheet, Text, Dimensions, ScrollView, ImageBackground, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;

export default class ApplyLoan extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username : '',
            selectedUser: '',
            amount: '',
            purpose: '',
            rate: '',
            duration: '',
            bank: '',
            account: '',
            ifsc: '',
            branch: '',
            error: false,
            loan : ''
        }
    }
    componentWillUnmount() {
        // Remove the back button event listener
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        // Handle the back button press
        this.props.navigation.goBack();
        return true; // Prevent the default back button action
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
        const supabaseKey = config.SUPABASE_API_KEY
        const supabase = createClient(supabaseUrl, supabaseKey);
    
        const user = await AsyncStorage.getItem('user');
        const { isAdmin, username } = JSON.parse(user);
        let { data, error } = await supabase.from('users').select('name').eq('username', username);
        this.setState({ selectedUser: data[0].name });
        const loan = this.props.route.params.loan;
        this.setState({ loan : loan.loanname ,username : username ,amount : String(loan.amount), rate: String(loan.interest_rate), duration: String(loan.duration)});
        
    }

    render() {

        const handleLoanMembers = async () => {

            const supabaseUrl = 'https://axubxqxfoptpjrsfuzxy.supabase.co'
            const supabaseKey = config.SUPABASE_API_KEY
            const supabase = createClient(supabaseUrl, supabaseKey);

            if (this.state.selectedUser == '' || this.state.amount == '' || this.state.purpose == '' || this.state.rate == '' || this.state.duration == '' || this.state.bank == '' || this.state.account == '' || this.state.ifsc == '' || this.state.branch == '') {
                Alert.alert("Please Fill All the Fields");

            }
            else {

                const finalDate = new Date(new Date().setMonth(parseInt(new Date().getMonth()) + parseInt(this.state.duration) - 1)).toISOString().slice(0, 10);
                try {
                    
                    await supabase.from('loan').insert([{
                        username: this.state.username,
                        name : this.state.selectedUser,
                        amount: this.state.amount,
                        purpose: this.state.purpose,
                        rate: this.state.rate,
                        duration: this.state.duration.valueOf(),
                        bank: this.state.bank,
                        account: this.state.account,
                        ifsc: this.state.ifsc,
                        branch: this.state.branch,
                        finaldate: finalDate,
                        loanname : this.state.loan,
                    }])


                   let members = []
                  
                   let data = (await supabase.from('Loans').select('members').eq('loanname', this.state.loan)).data[0].members
                   if(data != null)
                     {
                        data.map((item) => {
                            members.push(item)
                        })
                        members.push(this.state.username)
                     }
                     else
                     members.push(this.state.username)
                     await supabase.from('Loans').update({members : members}).eq('loanname', this.state.loan)
                   
                }

                catch (e) {
                    Alert.alert("Error in Registering Loan");
                }
            }
            Alert.alert("Loan Registered Successfully");

        }

        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white' }}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: width - 80, marginTop: 50 }}>

                        <TextInput
                         mode='outlined'
                         style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                         value={this.state.selectedUser}
                         editable={false}
                        />
                    </View>

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Amount"
                        mode='outlined'
                        value={this.state.amount}
                        left={<TextInput.Affix text="₹" />}
                        editable={false}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Loan Purpose"
                        mode='outlined'
                        value={this.state.purpose}
                        onChangeText={text => this.setState({ purpose: text })}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Interest Rate"
                        mode='outlined'
                        value={this.state.rate}
                        editable={false}
                        left={<TextInput.Affix text="%" />}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Duration"
                        mode='outlined'
                        value={this.state.duration}
                        editable={false}
                        right={<TextInput.Affix text="Months" />}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Bank Name"
                        mode='outlined'
                        value={this.state.bank}
                        onChangeText={text => this.setState({ bank: text })}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Account Number"
                        mode='outlined'
                        error={this.state.error}
                        value={this.state.account}
                        onChangeText={text => this.setState({ account: text })}
                        keyboardType='numeric'
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="IFSC Code"
                        mode='outlined'
                        value={this.state.ifsc}
                        onChangeText={text => this.setState({ ifsc: text })}
                    />

                    <TextInput
                        style={{ width: width - 80, marginTop: 20, backgroundColor: 'white' }}
                        label="Branch"
                        mode='outlined'
                        value={this.state.branch}
                        onChangeText={text => this.setState({ branch: text })}
                    />

                    <TouchableOpacity style={{ height: 40, width: 80, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 30, paddingBottom: 20 }} onPress={() => { handleLoanMembers() }}>
                        <ImageBackground source={require('../assets/bg.jpg')} borderRadius={5} style={{ height: 40, width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontFamily: 'InterTight-Bold', color: 'white' }}>Submit</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    <View style={{ marginBottom: 20 }}></View>


                </ScrollView>



            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
})