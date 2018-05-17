import React, { Component } from 'react'
import {connect} from 'react-redux'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Body, Right } from 'native-base';
import Modal from 'react-native-modal'
import foundationsActions from '../../actions/foundationsActions'

class MyServicesView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      allServices: [],
      isDetailVisible: false,
      serviceInModal: null
    }
    this._detailService = this._detailService.bind(this)
  }

  static navigationOptions = ({navigation}) => {
		const params = navigation.state.params || {};
		return{
			title: 'Servicios'
    }
	}
    
  componentDidMount() {
    foundationsActions.fetchAllServices(this.props.currentUser.uid).then( (val) =>{
      // console.log("RESPONSE", val)
      this.setState({allServices: val})
    })
  }
  _toggleModal = () =>
  this.setState({ isDetailVisible: !this.state.isDetailVisible });

  _detailService(serviceObj){
    console.log('serv',serviceObj)
    this.setState({ 
      isDetailVisible: !this.state.isDetailVisible,
      serviceInModal: serviceObj 
    })
  }
    

  
	render() {
    let services = this.state.allServices
    console.log('serviceInModal',this.state.serviceInModal?true:false)
    return (
      <View style={{flex:1}}> 
        {this.state.serviceInModal&&<Modal isVisible={this.state.isDetailVisible}
        onBackButtonPress={()=>this._toggleModal()}
        onBackdropPress={()=>this._toggleModal()}
        >
          <View style={styles.ModalContainer}>
            <Thumbnail source={{uri: this.state.serviceInModal.thumbnail}}/>
            <Text>{this.state.serviceInModal.type}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <Text>{this.state.serviceInModal.petInfo.dog&&'Dog'}</Text>
              <Text>{this.state.serviceInModal.petInfo.cat&&'Cat'}</Text>
              <Text>{this.state.serviceInModal.petInfo.hembra&&'Female'}</Text>
              <Text>{this.state.serviceInModal.petInfo.macho&&'Male'}</Text>
              <Text>{'Age: '+this.state.serviceInModal.petInfo.edad}</Text>
            </View>
          </View>
        </Modal>}
        <List>
          {
            services?(
              Object.keys(services).map((i)=>{
                
                return(
                  <ListItem key={i} onPress={()=>this._detailService(services[i])}>
                    <Thumbnail square size={80} source={{ uri: services[i].thumbnail }} />
                    <Body>
                      <Text>{services[i].petInfo.tempName}</Text>
                      <Text note> {services[i].type}</Text>
                    </Body>
                    <Text> {services[i].status}</Text>
                  </ListItem>
                ) 
                
              })
            ):(
              <Text>No Servicios :( </Text>
            )
          }
        </List>
      </View>
    )
  }
}
{/* <ListItem key={i}>
<Thumbnail square size={80} source={{ uri: services[i].thumbnail }} />
<Body>
  <Text>HI</Text>
  <Text note> {services[i].petId}</Text>
</Body>
</ListItem> */}
function mapStateToProps({currentUser}) {
  return {
    currentUser: currentUser,
  }
}
export default connect(mapStateToProps)(MyServicesView)

const styles = StyleSheet.create({
 ModalContainer:{
    flex: 0.6,
    flexDirection:'column', 
    backgroundColor:'white'
}
});