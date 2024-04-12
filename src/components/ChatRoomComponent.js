// import React, { useState } from 'react'
// import {over} from 'stompjs'
// import SockJS from 'sockjs-client'

// var stompClient = null;
// const ChatRoomComponent = () => {
// const [userData, setUserData]=useState({
//     username: '',
//     recieverName: '',
//     isConnected:false,
//     message:''
// })

// const handleUserName =(event) =>{
//     const {value} =event.target
//     setUserData({...userData,"username":value});
// }
// const registerUser=()=>{
// let Sock = new SockJS('http://localhost:8080/ws')
// stompClient=over(Sock)
// stompClient.connect({},onConnected,onError);

// }
// const onConnected=()=>{
//     setUserData=({...userData,"connected":true});
//     stompClient.subscribe('/chatroom/public, onPublicMessageReceived');
//     stompClient.subscribe('/user/'+userData.username+'/private',onPrivateMessageReceieved)
// }
// const onPublicMessageReceived =(payload) => {
//     let payloadData=JSON.parse(payload.body);
    

// }

//   return (
//     <div className='container'>
//         {userData.isConnected?
//         <div>

//         </div>
//         :
//         <div className='register'>
//             <input 
//             id='user-name'
//             placeholder='Enter your name'
//             value={userData.username}
//             onChange={handleUserName}
//             />
//             <button type='button' onClick={registerUser}>
//                 connect
//             </button>
//         </div> }
//         </div>
//   )
// }

// export default ChatRoomComponent