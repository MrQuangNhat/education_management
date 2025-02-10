import db from "../models/index";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hash(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
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

// Đăng nhập
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'role', 'password', 'name', 'active', 'avatar'],
                    where: { email: email },
                    raw: true
                });

                if (user) {
                    if (user.active === 0) {
                        userData.code = 9995;
                        userData.message = 'User has been deactivated';
                        resolve(userData);
                        return;
                    }

                    //check password
                    let check = await bcrypt.compare(password, user.password);
                    if (check) {
                        // Tạo JWT token
                        const token = jwt.sign(
                            { id: user.id, email: user.email, role: user.role },
                            process.env.JWT_SECRET || 'secret_key',
                            { expiresIn: '1d' } // Hết hạn sau 1 ngày
                        );

                        userData.code = 1000;
                        userData.message = 'OK';
                        delete user.password;
                        delete user.email;
                        userData.user = user;
                        userData.token = token;
                    } else {
                        userData.code = 1004;
                        userData.message = 'Wrong password';
                    }
                } else {
                    userData.code = 9995;
                    userData.message = 'User not found'
                }
            } else {
                // return error
                userData.code = 9995;
                userData.message = 'User not found';
            }
            resolve(userData)

        } catch (e) {
            reject(e)
        }
    })
}

// Đăng xuất
let handleLogout = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });

            if (user) {

                resolve({
                    code: 1000,
                    message: 'OK'
                });
            } else {
                resolve({
                    code: 9995,
                    message: 'User not found!'
                });
            }
        } catch (error) {
            reject({
                code: -1,
                message: 'Error from server!'
            });
        }
    });
};

let verificationCodes = {}; // Đối tượng lưu mã xác thực tạm thời

// Tạo mã xác thực và lưu trữ
let handleGenerateVerifyCode = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { email } });
            if (!user) {
                resolve({
                    code: 9995,
                    message: 'User not found!'
                });
                return;
            }

            // Tạo mã xác thực (6 chữ số)
            const verifyCode = Math.floor(100000 + Math.random() * 900000);
            verificationCodes[email] = verifyCode; // Lưu mã xác thực

            resolve({
                verifyCode
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Kiểm tra mã xác thực
let handleVerifyLogin = async (email, verifyCode) => {
    return new Promise((resolve, reject) => {
        try {
            if (!verificationCodes[email] || verificationCodes[email] !== Number(verifyCode)) {
                resolve({
                    code: 1004,
                    message: 'Invalid or expired verification code!'
                });
            } else {
                delete verificationCodes[email]; // Xóa mã xác thực sau khi kiểm tra thành công
                resolve({
                    code: 1000,
                    message: 'Verification successful!'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Đăng ký, tạo mới user
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password || !data.name) {
                resolve({
                    code: 1002,
                    errMessage: 'Parameter is not enough!'
                });
                return;
            }

            // Kiểm tra định dạng email bằng Regular Expression
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                resolve({
                    code: 1003,
                    errMessage: 'Invalid email format!'
                });
                return;
            }

            // Kiểm tra độ dài của password
            if (data.password.length < 6 || data.password.length > 10) {
                resolve({
                    code: 1003,
                    errMessage: 'Invalid password format!'
                });
                return;
            }

            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    code: 9996,
                    errMessage: 'User existed'
                })
            }
            let hashPasswordBcrypt = await hashUserPassword(data.password);
            let newUser = await db.User.create({
                email: data.email,
                password: hashPasswordBcrypt,
                name: data.name,
                active: data.active,
                role: data.role,
            });
            // Gán dữ liệu vào Student
            if (data) {
                await db.Student.create({
                    name: data.name,
                    email: data.email,
                    userId: newUser.id, // Liên kết với User
                });
            }

            resolve({
                code: 1000,
                message: 'create new user succeed'
            })

        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfo = (userId) => {
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

let updateUserInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    code: 1002,
                    errMessage: 'Missing required parameters!',
                });
                return;
            }

            // Tìm user trong bảng User
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                // Cập nhật thông tin User
                user.name = data.name || user.name;
                user.active = data.active || user.active;

                // Xử lý thay đổi vai trò
                if (user.role !== data.role) {
                    if (data.role === '0') {
                        // Nếu role thay đổi từ 1 (student) thành 0 (teacher)
                        // Thêm vào bảng Teacher
                        let teacher = await db.Teacher.findOne({ where: { userId: user.id } });
                        if (!teacher) {
                            await db.Teacher.create({
                                name: data.name || user.name,
                                email: user.email,
                                userId: user.id, // Liên kết với User
                            });
                        }

                        // Xóa khỏi bảng Student
                        await db.Student.destroy({ where: { userId: user.id } });
                    } else if (data.role === '1') {
                        // Nếu role thay đổi từ 0 (teacher) thành 1 (student)
                        // Thêm vào bảng Student
                        let student = await db.Student.findOne({ where: { userId: user.id } });
                        if (!student) {
                            await db.Student.create({
                                name: data.name || user.name,
                                email: user.email,
                                userId: user.id, // Liên kết với User
                            });
                        }

                        // Xóa khỏi bảng Teacher
                        await db.Teacher.destroy({ where: { userId: user.id } });
                    }
                    // Cập nhật vai trò mới
                    user.role = data.role;
                }
                // Lưu thông tin User sau khi cập nhật
                await user.save();

                resolve({
                    code: 1000,
                    message: 'Update user succeeds!',
                });
            } else {
                resolve({
                    code: 9996,
                    message: 'User does not exist!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};


let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                code: 9996,
                errMessage: 'User is not exist'
            })
        }

        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            code: 1000,
            message: 'User deleted'
        })
    })
}


// Đổi mật khẩu
const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        // Kiểm tra mật khẩu cũ hợp lệ
        const user = await db.User.findOne({ where: { id: userId }, raw: false });
        if (!user) {
            return { code: 9992, message: "Người dùng không tồn tại." };
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return { code: 1005, message: "Mật khẩu cũ không đúng." };
        }

        // Kiểm tra tính hợp lệ của mật khẩu mới
        if (newPassword.length < 6 || newPassword.length > 12) {
            return { code: 1004, message: "Mật khẩu mới không hợp lệ." };
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Lưu mật khẩu mới vào CSDL
        user.password = hashedPassword;
        await user.save();

        return { code: 1000, message: "Đổi mật khẩu thành công." };
    } catch (error) {
        console.error("Error in changePassword:", error);
        return { code: 500, message: "Lỗi hệ thống", error };
    }
};


module.exports = {
    createNewUser,
    handleUserLogin,
    handleLogout,
    getUserInfo,
    deleteUser,
    updateUserInfo,
    handleGenerateVerifyCode,
    handleVerifyLogin,
    changePassword,
}