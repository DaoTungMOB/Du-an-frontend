import axios from "axios";
import { axiosJWT } from "./UserService";

// Hàm lấy tất cả sản phẩm có thể được lọc theo tên và giới hạn số lượng
export const getAllProduct = async (search, limit) => {
    let res = {};
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}`);
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`);
    }
    return res.data;
}

// Hàm lấy tất cả sản phẩm của một loại cụ thể, có thể được phân trang và giới hạn số lượng
export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`);
        return res.data;
    }
}

// Hàm tạo mới một sản phẩm
export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data);
    return res.data;
}

// Hàm lấy chi tiết của một sản phẩm dựa trên ID
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-details/${id}`);
    return res.data;
}

// Hàm cập nhật thông tin của một sản phẩm
export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

// Hàm xóa một sản phẩm dựa trên ID và token xác thực
export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

// Hàm xóa nhiều sản phẩm dựa trên danh sách ID và token xác thực
export const deleteManyProduct = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

// Hàm lấy tất cả loại sản phẩm có sẵn
export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`);
    return res.data;
}
