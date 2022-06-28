import User from '../models/user.model';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import { string } from '@hapi/joi';

//get all users
export const getAllUsers = async () => {
  const data = await User.find();
  return data;
};

//create new user by registration
export const userRegistration = async (body) => {
  // console.log("body before hashing",body);
  const saltRounds=10
  const hashpassword =await bcrypt.hash(body.password,saltRounds)
  // console.log("hash password",hashpassword);
  body.password = hashpassword;
  // console.log("after hash",body);
  const data = await User.create(body);
  return data;
};



// login User############

export const login = async (body) => {

  const result = await User.findOne({email:body.email});
  // console.log(result)
  
  if(result != null){
    
    const comparePass =await bcrypt.compare(body.password, result.password);
    if(comparePass){

      var token = jwt.sign({ id:result._id, firstname:result.firstname,lastname:result.lastname,password:result.password }, process.env.SECRATEKEY);
      return token
    
    }else{
      throw new Error("Password is incorrect")
    }


  }else{
    throw new Error("Mail Is not exist")
  }
}

// if(result){
  //   const comparePass =await bcrypt.compare(body.password, result.password);
  //   console.log(comparePass);
  //   if(comparePass){
  //     return result;
  //   }
  //   else{
  //     difError;
  //   }
    
  // }

// };

//update single user
export const updateUser = async (_id, body) => {
  const data = await User.findByIdAndUpdate(
    {
      _id
    },
    body,
    {
      new: true
    }
  );
  return data;
};

//delete single user
export const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return '';
};

//get single user
export const getUser = async (id) => {
  const data = await User.findById(id);
  return data;
};

