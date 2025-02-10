import materialService from "../services/materialService";

module.exports = {
    // Upload material
    uploadMaterial: async (req, res) => {
        try {
            const { class_id, title, description, type } = req.body;
            const file = req.file;  // Lấy file từ request body (file sẽ được gửi qua form-data)
            const { role } = req.user;  // Kiểm tra role người dùng (nếu cần)

            if (role !== "0") {  // Kiểm tra nếu người dùng không phải giảng viên
                return res.status(403).json({ code: 1003, message: "Access denied" });
            }

            if (!class_id || !title || !description || !type) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số trong yêu cầu" });
            }

            // Gọi service để xử lý tải lên tài liệu
            const result = await materialService.uploadMaterial(class_id, title, description, file, type);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in uploadMaterial:", error);
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },


    // Lấy danh sách tài liệu
    getMaterialList: async (req, res) => {
        try {
            const { class_id } = req.query; // Lấy class_id từ query

            if (!class_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số class_id" });
            }

            const result = await materialService.getMaterialList(class_id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Lấy thông tin chi tiết của tài liệu
    getMaterialInfo: async (req, res) => {
        try {
            const { material_id } = req.query; // Lấy material_id từ query

            if (!material_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số material_id" });
            }

            const result = await materialService.getMaterialInfo(material_id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Xóa tài liệu
    deleteMaterial: async (req, res) => {
        try {
            const { material_id } = req.body; // Lấy material_id từ body

            if (!material_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số material_id" });
            }

            const result = await materialService.deleteMaterial(material_id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },

    // Chỉnh sửa tài liệu
    editMaterial: async (req, res) => {
        try {
            const { id, role } = req.user;
            const { material_id, title, description, file, file_del } = req.body; // Lấy các tham số từ body

            if (role !== "0") {
                return res.status(403).json({ code: 1003, message: "Access denied" });
            }

            if (!material_id) {
                return res.status(400).json({ code: 1004, message: "Thiếu tham số material_id" });
            }

            const result = await materialService.editMaterial(material_id, title, description, file, file_del);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ code: 2, message: "Internal server error", error });
        }
    },
};
