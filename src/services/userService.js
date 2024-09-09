import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}

            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exist
                // compare password
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'fullName'],
                    where: { email: email },
                    raw: true

                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }

                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User is not found'
                }

            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = 'Email is not exist';
            }
            resolve(userData)

        } catch (e) {
            reject(e)
        }
    })

}



let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {

            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }

                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }

                })
            }
            resolve(users)

        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'This email has already exist, please try a new one'
                })
            } else {
                let hashPassordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassordFromBcrypt,
                    fullName: data.fullName,
                    studentCode: data.studentCode,
                    roleId: data.roleId,
                })
            }


            resolve({
                errCode: 0,
                message: 'create new user succeed'
            })

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: 'User is not exist'
            })
        }

        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            message: 'User deleted'
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters!'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.fullName = data.fullName;
                user.studentCode = data.studentCode;
                user.roleId = data.roleId;

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update user succeeds!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not exist!'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let res = {};
                let allcode = await db.Allcodes.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}