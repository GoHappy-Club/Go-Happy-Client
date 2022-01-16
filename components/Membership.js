import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView, Dimensions } from 'react-native';

import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import { Text, Button} from 'react-native-elements';
import RazorpayCheckout from 'react-native-razorpay';


import { connect } from 'react-redux';
import { changeCount, setProfile } from '../redux/actions/counts.js';
import { bindActionCreators } from 'redux';


class Membership extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
			name: '',
			email:'',
			membership:'',
			city:'Pune',
			state:'Maharashtra',
			backgroundColor:'white',
			textColor:'black',
			plans:{
				selectedItem:'',
				planDetails:[{
					amount:99,
					duration:'1 month',
					textColor:'black',
					backgroundColor:'white',
					selected:false,
					name:'Basic'
				},
				{
					amount:249,
					duration:'3 months',
					textColor:'black',
					backgroundColor:'white',
					selected:false,
					name:'Silver'
				},
				{
					amount:549,
					duration:'6 months',
					textColor:'black',
					backgroundColor:'white',
					selected:false,
					name:'Gold'
				},
				{
					amount:1099,
					duration:'1 year',
					textColor:'black',
					backgroundColor:'white',
					selected:false,
					name:'Premium'
				}]
			}
		}
		this._retrieveData();
	}
	async razorPay(){
		var orderId = await this.props.getOrderId(this.state.plans.planDetails[this.state.plans.selectedItem?this.state.plans.selectedItem:0].amount*100);
		console.log('in razorpay',this.state.plans.planDetails[this.state.plans.selectedItem].amount);
		var options = {
			description: 'GoHappy Subscription',
			currency: 'INR',
			key: 'rzp_test_sMRXf9zvPN1rCs',
			amount: this.state.plans.planDetails[this.state.plans.selectedItem].amount*100,
			name: this.state.plans.planDetails[this.state.plans.selectedItem].name+' Membership',
			order_id: orderId,//Replace this with an order_id created using Orders API.
			prefill: {
			email: this.state.email,
			contact: '9888138824', 
			name: 'Rakshit Sharma'
			},
			theme: {color: '#53a20e'}
		}	
		RazorpayCheckout.open(options).then((data) => {
			// handle success
			alert(`Success: ${data.razorpay_payment_id}`);
			var _this = this;
			this.props.setMembership(this.state.email,this.state.plans.planDetails[this.state.plans.selectedItem?this.state.plans.selectedItem:0].name,
				function(){
					_this.props.navigation.navigate('GoHappy Club')

				});
		}).catch((error) => {
			// handle failure
			alert(`Error: ${error.code} | ${error.description}`);
		});
	
	}
	planSelected(plan,index){
		console.log('index',index);
		var allPlans = this.state.plans;
		plan.backgroundColor='blue';
		plan.textColor='white';
		allPlans.planDetails[index]=plan;
		allPlans.selectedItem=index;
		for(var i=0;i<allPlans.planDetails.length;i++){
			if(i==index){
				continue;
			}
			allPlans.planDetails[i].backgroundColor='white';
			allPlans.planDetails[i].textColor='black';
		}
		this.setState({plans:allPlans});
	}
	_retrieveData = async () => {
		try {
		  const name = await AsyncStorage.getItem("name");
		  const email = await AsyncStorage.getItem("email");
		  const profileImage = await AsyncStorage.getItem("profileImage");
		  const membership = await AsyncStorage.getItem("membership");
		  this.setState({name:name});
		  this.setState({email:email});
		  this.setState({profileImage:profileImage});
		  this.setState({membership:membership})
		  console.log('get async',name);
		  
		} catch (error) {
		  // Error retrieving data
		  console.log('error here',error)
		}
	  };
  
	renderPlans(plan,key) {

		console.log('here',plan,key);
		  return(
			<View style={{width:'50%'}}>
                <TouchableOpacity style={{backgroundColor: plan.backgroundColor, 
                    shadowColor: "black",elevation: 10,
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.3, borderRadius:10,
                    height:100,margin:30,justifyContent:'center',
                    alignItems:'center'
				}} onPress={this.planSelected.bind(this,plan,key)}>
                <View style={{justifyContent:'center', alignItems:'center'
				}}>
                    <Text style={{fontSize:30,color:plan.textColor}}>₹{plan.amount}</Text> 
                    <Text style={{color:plan.textColor}}>{plan.duration}</Text>                    
                </View>
                </TouchableOpacity>
            </View>
		  );
		
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<View style = {{
				backgroundColor: 'white',flex:1
			}}>
				<ScrollView style = {{
					backgroundColor: 'white',height:'100%'
				}}
				contentContainerStyle={{justifyContent: 'center',
				alignItems: 'center'}}
				>
					
					<Text h1 style={{fontWeight:'bold',marginTop:'25%'}}>Choose your plan</Text>
					<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
						{
						this.state.plans.planDetails.map((item, key) =>
							(
								this.renderPlans(item,key)
							))
					}</View>

					<View style={{marginTop:20,width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity  disabled={this.state.plans.selectedItem===''}
						 style={this.state.plans.selectedItem==='' && styles.checkoutButtonDisabled || styles.checkoutButtonEnabled}
						 onPress={this.razorPay.bind(this)}>
							<View>
								<Text style={styles.optionList}>Proceed to Checkout</Text>
							</View>
						</TouchableOpacity>
					</View>
					
					
					
				</ScrollView>
				
				
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container1: {
		flex: 1,
		backgroundColor: '#0A1045'
	},
	cover:{
		flex: 1,
    	justifyContent: "center",

	},
	cardText:{
		textAlign:'center',
		marginTop:10
	},
	optionList:{
		fontSize:16,
		padding:10,
		color:'white'
	},
	checkoutButtonDisabled:{
		opacity:0.5,
		alignItems: "center",
		backgroundColor: "blue",
		padding: 10
	},
	checkoutButtonEnabled:{
		alignItems: "center",
		backgroundColor: "blue",
		padding: 10
	}
});

const mapStateToProps = state => ({
	profile:state.profile.profile
  });

  const ActionCreators = Object.assign(
	{},
	{setProfile}
  );
  const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(ActionCreators, dispatch),
  });

  export default connect(mapStateToProps, mapDispatchToProps)(Membership)