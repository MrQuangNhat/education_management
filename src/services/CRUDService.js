import bcrypt from 'bcrypt'
import db from "../models/index";
import { raw } from 'body-parser';


const saltRounds = 10;

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassordFromBcrypt,
                fullName: data.fullName,
                teacherCode: data.teacherCode,
                roleId: data.roleId,
            })

            resolve('create new user succeed')

        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, saltRounds);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
}