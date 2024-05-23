const mongoose = require('mongoose')
const express = require('express')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/userSchema')

exports.Register = async (req, res) => {
    try {
        // const register = await usermodel.create(req.body)
        // res.json({message:req.body})

        const {name, email, phone, password, cpassword} = req.body;

        if(!name || !email || !phone || !password || !cpassword){
            return res.status(400).json({error: "Plz filled the field properly"});
        }

        /*User.findOne({email: email})
            .then((userExist) => {
                if(userExist){
                    res.status(422).json({ error: "User already exists"})
                }

                const user = new User({name, email, phone, password, cpassword})

                user.save().then(() => {
                    res.status(201).json({ message: "Register Successfuly"})
                }).catch((err) => {
                    res.status(500).json({ message: "Registration Faied!"})
                })
            }).catch( err => {console.log(err)});*/

        const userExist = await User.findOne({email: email})

        if(userExist){
            res.status(422).json({ error: "Email is already exists"})
        }else if(password != cpassword){
            res.status(422).json({ error: "Password does not match"})
        }else{
            // const user = new User({name, email, phone,password, cpassword})

            const userCreated = await User.create(req.body)
            await userCreated.save();

            res.status(201).json({ message: "User Registartion Successfull",
                token: await userCreated.generateAuthToken(),
                userId: userCreated._id.toString()
            });
        }

    } catch (error) {
        error
    }
}

exports.Login = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password){
            res.status(400).json({ error: "Please enter your email and password"})
        }

        const userLogin = await User.findOne({email: email})

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password)

            let token = await userLogin.generateAuthToken();
            console.log(token)


            if(!isMatch){
                res.status(400).json({ message: "Invalid Credientials"})
            }else{
                res.status(200).json({ message: "Login Successfully",
                    token: await userLogin.generateAuthToken(),
                    userId: userLogin._id.toString()
                })
            }
        }else{
            res.status(400).json({ message: "Invalid Credientials"})
        }

    } catch (error) {
        console.log(error)
    }
}

exports.getData = async (req,res) => {
    try {
        res.send("Hello") 
    } catch (error) {
       error
    }
}
