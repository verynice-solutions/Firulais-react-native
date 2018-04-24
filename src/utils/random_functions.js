function _getGoogleProfileInfo(params = { onSuccess: (response)=>{} }, userCredentials) {
  let { request,} = this.props // currentUser 
  request(
    {
      method: 'GET',
      path: `https://www.googleapis.com/oauth2/v1/userinfo?`,
      params: {
        fields:['email','family_name','gender','given_name','hd','id','link','locale','name','picture','verified_email'],
        access_token: userCredentials.accessToken,
      },
      beforeRequestStart: () => {
        this.setState({ isFetching: true })
      },
      onSuccess: (response)=>{
        // console.log('Google profile info response',response)
        
        this.props.storeCurrentUser({
          token: userCredentials.accessToken,id_token: userCredentials.idToken, signInData: response.data
        })
        this.setState({
          isFetching: false
        })
      },
      onError: (response) => {
        console.log(response)
      }
    }
  )
}
function randomPuppers() {
  let arrayOfDoggos = [
  'https://i.amz.mshcdn.com/WdTY0f7QzqQe-zMY8TA6YA-ykik=/fit-in/575x4096/2015%2F08%2F24%2F09%2FScreenShot2.8f1f5.png',
  'https://www.petresort.com/wp-content/uploads/2015/11/cat-dog-boarding-together-seattle.jpg',
  'https://global-free-classified-ads-s02.r.worldssl.net/user_images/4646957.jpg',
  'https://pics.me.me/opet-when-she-calls-you-a-pupper-when-technically-your-14988170.png'
  ]
  return arrayOfDoggos[Math.floor(Math.random() * arrayOfDoggos.length)]
}
const random_functions = {
  _getGoogleProfileInfo,
  randomPuppers
}
export default random_functions;