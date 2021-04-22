import React from 'react';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/Entypo';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import FaIcons5 from 'react-native-vector-icons/FontAwesome5';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const icons = {
  emailIcon: <EntypoIcons name='email' size={25} color='#000000' />,
  passwordIcon: <EvilIcons name='lock' size={25} color='#000000' />,
  userIcon: <FaIcons5 name='user' size={25} color='#000000' />,
  dateIcon: <EvilIcons name='calendar' size={25} color='#000000' />,
  cpfIcon: <IonicIcon name='md-card-outline' size={25} color='#000000' />,
  recoveryCodeIcon: <MaterialCommunityIcons name='file-restore-outline' size={30} color='#000000' />,
  redefinePasswordIcon: <MaterialCommunityIcons name='lock-reset' size={30} color='#000000' />,
  sendEmailIcon: <MaterialCommunityIcons name='email-check-outline' size={30} color='#000000' />,
  signInIcon: <FaIcons name='sign-in' size={30} color='#000000' />,
  signUpIcon: <FaIcons name='pencil-square-o' size={30} color='#000000' />,
};

export default icons;
