import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let { email, password, verifyCode } = req.query; // Lấy các tham số từ query string

    try {
        // Bước 1: Kiểm tra email và mật khẩu
        if (!email || !password) {
            return res.status(400).json({
                code: 1002,
                message: 'Missing email or password!'
            });
        }

        // Lấy dữ liệu người dùng từ userService
        let userData = await userService.handleUserLogin(email, password);


        // Nếu không có mã xác thực, tạo mã và gửi lại client
        if (!verifyCode) {
            let response = await userService.handleGenerateVerifyCode(email);
            return res.status(200).json(response);
        }

        // Bước 2: Kiểm tra mã xác thực (verifyCode)
        let verifyResponse = await userService.handleVerifyLogin(email, verifyCode);
        if (verifyResponse.code !== 1000) {
            return res.status(400).json(verifyResponse);
        }

        // Bước 3: Đăng nhập thành công, trả về token và thông tin người dùng
        return res.status(200).json({
            code: 1000,
            message: 'OK',
            user: userData.user,
            token: userData.token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: -1,
            message: 'Server error!'
        });
    }
};

let handleLogout = async (req, res) => {
    try {
        let { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Missing userId!'
            });
        }

        let response = await userService.handleLogout(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error); // Log lỗi để debug
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server!'
        });
    }
};

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.query);
    return res.status(200).json(message);
}

let handleGetUserInfo = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })
    }
    let users = await userService.getUserInfo(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleEditUser = async (req, res) => {
    let data = req.query;
    let message = await userService.updateUserInfo(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.query.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    let message = await userService.deleteUser(req.query.id);
    return res.status(200).json(message);
}

const changePassword = async (req, res) => {
    const { id } = req.user; // lấy userId từ token
    const { oldPassword, newPassword } = req.body; // lấy oldPassword và newPassword từ request body

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ code: 1002, message: "Thiếu tham số mật khẩu" });
    }

    try {
        const result = await userService.changePassword(id, oldPassword, newPassword);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi hệ thống", error });
    }
};

module.exports = {
    handleLogin,
    handleLogout,
    handleCreateNewUser,
    handleGetUserInfo,
    handleEditUser,
    handleDeleteUser,
    changePassword,
}