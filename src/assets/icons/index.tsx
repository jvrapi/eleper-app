import React from 'react';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/Entypo';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import FaIcons5 from 'react-native-vector-icons/FontAwesome5';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const pageIcons = {
  searchIcon: <MaterialIcons name='search' size={30} color='#A9A9A9' />,
  myExamsIcon: <FaIcons5 name='file-medical' size={40} color='#000000' />,
  myRecordIcon: <FaIcons5 name='book-medical' size={40} color='#000000' />,
  infoIcon: <Feather name='info' size={20} color='#A9A9A9' />,
  examDetailsIcon: <MaterialCommunityIcons name='file-document-edit-outline' size={120} color='#000000' />,
  newExamIcon: <Feather name='file-plus' size={100} color='#000000' />,
};

export const inputIcons = {
  emailIcon: <EntypoIcons name='email' size={30} color='#000000' />,
  passwordIcon: <EvilIcons name='lock' size={30} color='#000000' />,
  userIcon: <FaIcons5 name='user' size={30} color='#000000' />,
  dateIcon: <EvilIcons name='calendar' size={30} color='#000000' />,
  cpfIcon: <IonicIcon name='md-card-outline' size={30} color='#000000' />,
  recoveryCodeIcon: <MaterialCommunityIcons name='file-restore-outline' size={30} color='#000000' />,
  diseaseIcon: <FaIcons5 name='disease' size={30} color='#000000' />,
  nameIcon: <MaterialIcons name='drive-file-rename-outline' size={30} color='#000000' />,
  myExamsIcon: <FaIcons5 name='file-medical' size={30} color='#000000' />,
  pdfIcon: <AntDesign name='pdffile1' size={30} color='#000000' />,
};

export const buttonIcons = {
  signInIcon: <FaIcons name='sign-in' size={30} color='#FFFFFF' />,
  signUpIcon: <FaIcons name='pencil-square-o' size={30} color='#FFFFFF' />,
  checkIcon: <Feather name='check' size={30} color='#FFFFFF' />,
  cancelIcon: <MaterialCommunityIcons name='cancel' size={30} color='#FFFFFF' />,
  continueIcon: <Feather name='arrow-right' size={30} color='#FFFFFF' />,
  uploadIcon: <FaIcons5 name='upload' size={30} color='#FFFFFF' />,
  downloadIcon: <FaIcons5 name='file-download' size={30} color='#FFFFFF' />,
  sendEmailIcon: <MaterialCommunityIcons name='email-check-outline' size={30} color='#FFFFFF' />,
  redefinePasswordIcon: <MaterialCommunityIcons name='lock-reset' size={30} color='#FFFFFF' />,
  examEditIcon: <MaterialCommunityIcons name='file-document-edit-outline' size={30} color='#FFFFFF' />,
  terminatedEditExamIcon: <MaterialCommunityIcons name='file-check-outline' size={30} color='#FFFFFF' />,
  deleteExamIcon: <MaterialCommunityIcons name='file-remove-outline' size={30} color='#FFFFFF' />,
  newExamIcon: <Feather name='file-plus' size={30} color='#FFFFFF' />,
};
