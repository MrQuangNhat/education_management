import db from "../models/index";
import fs from "fs";
import path from "path";

module.exports = {
    // Upload material (tải lên tài liệu)
    uploadMaterial: async (classId, title, description, file, type) => {
        try {
            if (!file) {
                return { code: 1005, message: "File is required" };
            }

            // Tạo đường dẫn lưu file
            // const filePath = path.join(__dirname, "..", "uploads", file.name);

            // Di chuyển file từ bộ nhớ đệm (memory) vào thư mục uploads
            fs.writeFileSync(filePath, file.data);

            // Tạo tài liệu mới trong cơ sở dữ liệu
            const material = await db.Material.create({
                classId,
                title,
                description,
                // link: file,
                type, // type có thể là 'lecture', 'extra_reading', 'video'
            });

            return { code: 1000, message: "Tài liệu đã được tải lên thành công", data: material };
        } catch (error) {
            console.error("Error in uploadMaterial:", error);
            throw error;
        }
    },

    // Lấy danh sách tài liệu
    getMaterialList: async (class_id) => {
        try {
            const materials = await db.Material.findAll({ where: { classId: class_id } });
            if (materials.length === 0) {
                return { code: 1000, message: "OK", data: [] };
            }

            return { code: 1000, message: "OK", data: materials };
        } catch (error) {
            console.error("Error in getMaterialList:", error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết của tài liệu
    getMaterialInfo: async (material_id) => {
        try {
            const material = await db.Material.findOne({ where: { id: material_id } });
            if (!material) {
                return { code: 9992, message: "Tài liệu không tồn tại" };
            }

            return { code: 1000, message: "OK", data: material };
        } catch (error) {
            console.error("Error in getMaterialInfo:", error);
            throw error;
        }
    },

    // Xóa tài liệu
    deleteMaterial: async (material_id) => {
        try {
            const material = await db.Material.findOne({ where: { id: material_id } });
            if (!material) {
                return { code: 9992, message: "Tài liệu không tồn tại" };
            }

            await db.Material.destroy({ where: { id: material_id } });
            return { code: 1000, message: "OK", data: "Tài liệu đã xóa" };
        } catch (error) {
            console.error("Error in deleteMaterial:", error);
            throw error;
        }
    },

    // Chỉnh sửa tài liệu
    editMaterial: async (material_id, title, description, file, file_del) => {
        try {
            // Truy vấn tài liệu với raw: false để đảm bảo trả về một instance
            const material = await db.Material.findOne({
                where: { id: material_id },
                raw: false // Chỉ định raw: false để trả về instance Sequelize
            });

            if (!material) {
                return { code: 9992, message: "Tài liệu không tồn tại" };
            }

            // Kiểm tra tiêu đề và mô tả
            if (title && title.trim() === "") {
                return { code: 1006, message: "Tiêu đề không được trống" };
            }

            if (description && description.length > 500) {
                return { code: 1013, message: "Mô tả không được vượt quá giới hạn ký tự" };
            }

            // Cập nhật các trường của tài liệu
            material.title = title || material.title;
            material.description = description || material.description;
            material.link = file || material.link;

            // Lưu lại các thay đổi vào cơ sở dữ liệu
            await material.save();

            return { code: 1000, message: "OK", data: material };
        } catch (error) {
            console.error("Error in editMaterial:", error);
            throw error;
        }
    },

};
