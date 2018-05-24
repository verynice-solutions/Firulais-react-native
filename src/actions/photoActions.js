import firebase from "../firebase/firebaseSingleton";
import {ImageManipulator} from 'expo'

async function _uploadImage(localUri,entityId,fotoName){
  // Optimization de Images of various sizes
  // ejemplos de compresión: (4MB -> 500 KB) (2MB -> 382KB) (800KB -> 84KB)

  //Fetchear foto sin comprimir
  const original = await fetch(localUri)
  const blopOriginal = await original.blob()

  //Encontrar la mejor relación peso-calidad:
  let size = blopOriginal.size
  let quality = 1
  if(size>100000){
    quality = 0.7
    if(size>200000){
      quality = 0.65
      if(size>500000){
        quality = 0.6
        if(size>1000000){
          quality = 0.3
          if(size>4000000){
            quality = 0.25
            if(size>10000000){
              quality = 0.2
            }
          }
        }
      }
    }
  }  
  const compressedPhoto = await ImageManipulator.manipulate(
    localUri,[{rotate: 0}],{ compress: quality }
  )

  // fetchear foto optimizada
  const response = await fetch(compressedPhoto.uri)
  const blop = await response.blob()

  // Mandar a la db imagen optimizada 
  let storage_ref = `images/pets/${entityId}/${fotoName}`
  var ref = firebase.storage().ref().child(storage_ref)
  return ref.put(blop)
  // ¡ PROFIT ! 
}

const photoActions = {
  _uploadImage,
}

export default photoActions