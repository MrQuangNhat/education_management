import { defaults } from "lodash";
import db from "../models/index";
require('dotenv').config();

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.teacherId || !data.timeType || !data.date
                || !data.fullName || !data.studentCode
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        fullName: data.fullName,
                        studentCode: data.studentCode,
                        roleId: 'R2'
                    },
                });

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { studentId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            teacherId: data.teacherId,
                            studentId: user[0].id,
                            date: data.date,
                            timeType: data.timeType
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor student succeed'
                })
            }
        } catch (e) {
            console.log(e);
            reject(e);

        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
}