import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo trạng thái ban đầu của slice user
const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    id: '',
    isAdmin: false,
    city: '',
    refreshToken: ''
}

// Tạo slice user sử dụng createSlice từ Redux Toolkit
export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Hành động cập nhật thông tin người dùng
        updateUser: (state, action) => {
            // Lấy các giá trị từ action.payload và gán cho các thuộc tính tương ứng trong state
            const { name = '', email = '', access_token = '', address = '', phone = '', avatar = '', _id = '', isAdmin,city= '',refreshToken = '' } = action.payload
            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            state.address = address ? address : state.address;
            state.phone = phone ? phone : state.phone;
            state.avatar = avatar ? avatar : state.avatar;
            state.id = _id ? _id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
            state.city = city ? city : state.city;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
        },
        // Hành động reset thông tin người dùng
        resetUser: (state) => {
            // Đặt lại các thuộc tính của state về giá trị ban đầu
            state.name = '';
            state.email = '';
            state.address = '';
            state.phone = '';
            state.avatar = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.city = '';
            state.refreshToken = ''
        },
    },
})

// Action creators được tạo ra cho mỗi hàm reducer
export const { updateUser, resetUser } = userSlide.actions

// Xuất reducer từ slice user
export default userSlide.reducer