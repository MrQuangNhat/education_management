import studentService from '../services/studentService';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await studentService.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
}