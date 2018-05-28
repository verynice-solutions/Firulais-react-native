export function _getGoogleProfileInfo(params = { onSuccess: (response)=>{} }, userCredentials) {
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
export function register(data, successCB, errorCB) {
  return (dispatch) => {
      api.register(data, function (success, data, error) {
          if (success) successCB(data);
          else if (error) errorCB(error)
      });
  };
}
export function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function _getNowDateISO(){
  // to 2018-02-31T12:05:23 like
  let d = new Date()
  let month = (d.getMonth()+1).toString()
  month = month<10? '0'+month : month
  let day = d.getDate().toString()
  day = day<10? '0'+day : day
  let hours = d.getHours().toString()
  hours = hours<10? '0'+hours : hours
  let minutes = d.getMinutes().toString()
  minutes = minutes<10? '0'+minutes : minutes
  let seconds = d.getSeconds().toString()
  seconds = seconds<10? '0'+seconds : seconds
  return `${d.getFullYear()}-${month}-${day}
    T${hours}:${minutes}:${seconds}`
}

export function _getNextYear(){
  // to 2018-02-31T12:05:23 like
  let d = new Date()
  let month = (d.getMonth()+1).toString()
  month = month<10? '0'+month : month
  let day = d.getDate().toString()
  day = day<10? '0'+day : day
  let hours = d.getHours().toString()
  hours = hours<10? '0'+hours : hours
  let minutes = d.getMinutes().toString()
  minutes = minutes<10? '0'+minutes : minutes
  let seconds = d.getSeconds().toString()
  seconds = seconds<10? '0'+seconds : seconds
  return `${d.getFullYear()+1}-${month}-${day}
    T${hours}:${minutes}:${seconds}`
}

export function randomPuppers() {
  let arrayOfDoggos = [
  'https://data.whicdn.com/images/298844185/large.jpg?t=1507433077',
  'https://paradelle.files.wordpress.com/2014/04/dog-wink.jpg',
  'https://i.ytimg.com/vi/I0XPI7Knxxc/maxresdefault.jpg',
  'https://i.imgflip.com/4a8he.jpg'
  ]
  return arrayOfDoggos[Math.floor(Math.random() * arrayOfDoggos.length)]
}