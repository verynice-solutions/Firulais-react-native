import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Button } from 'native-base';
import DatePicker from 'react-native-datepicker'
import userActions from '../../actions/usersActions'
import {_getNowDateISO, _getNextYear} from '../../utils/random_functions'

class CreateService extends Component {
	constructor(props) {
    super(props)
    this.state = {
      selectedView: 0,
      date: _getNowDateISO()
    }
    this.toggleAdopt = this.toggleAdopt.bind(this)
    this.toggleCare = this.toggleCare.bind(this)

  }
	static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Pedir Servicio'
    }
  }
  
  componentDidMount() {

  }
  
  toggleAdopt() {
    this.setState({selectedView: 0})
  }

  toggleCare() {
    this.setState({selectedView: 1})
  }

  renderBtns = () => {
    if(this.state.selectedView === 0){
      return <View style={{flex:0, marginTop:10, flexDirection: 'row', justifyContent:'space-around'}}>
        <Button onPress={this.toggleAdopt} rounded info>
            <Text>Adoptar</Text>
        </Button>
        <Button onPress={this.toggleCare} rounded light>
            <Text>Cuidar</Text>
        </Button>
      </View>
    }else{
      return <View style={{flex:0, marginTop:10, flexDirection: 'row', justifyContent:'space-around'}}>
        <Button onPress={this.toggleAdopt} rounded light>
            <Text>Adoptar</Text>
        </Button>
        <Button onPress={this.toggleCare} rounded info>
            <Text>Cuidar</Text>
        </Button>
      </View>
    }
  }
  renderAdopt = () =>{
    let ids = this.props.navigation.getParam('toModal')
    return(
      <View style={styles.subcontainer}>
        <Text> Adopt me, you pretty face :3 </Text>
        <Text>{ids.pid}</Text>
        <Text>{ids.fid}</Text>
      </View>
    )
  }

  renderCare = ()=>{
    return(
      <View style={styles.subcontainer}>
        <Text> Or wanna take care of my ass :D </Text>
        {this.renderDatePicker()}
        <View><Button rounded info>
          <Text>Sure?</Text>
        </Button></View>
      </View>
    )
  }
  renderDatePicker = () => {
    return <View><DatePicker
      style={{width: 200}}
      date={this.state.date}
      mode="date"
      placeholder="select date"
      format="YYYY-MM-DD"
      minDate={_getNowDateISO()}
      maxDate={_getNextYear()}
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateIcon: {
          position: 'absolute',
          left: 0,
          top: 4,
          marginLeft: 0
        },
        dateInput: {
          marginLeft: 36
        }
        // ... You can check the source to find the other keys.
      }}
      onDateChange={(date) => {this.setState({date: date})}}
    /></View>
  }

	render() {
    
    return (
      <View style={{ flex: 0.6, justifyContent:'center'}}> 

        {this.renderBtns()}
        {
          this.state.selectedView === 0 ? (
            this.renderAdopt()
          ):(
            this.renderCare()
          )
        }

      </View>
    )
  }
}

function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(CreateService)

const styles = StyleSheet.create({
 subcontainer: {
   flex:1, 
   padding:20, 
   margin: 10, 
   alignItems:'center', 
   justifyContent:'space-between'
  }
});