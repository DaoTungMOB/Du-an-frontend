import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo trạng thái ban đầu của slice
const initialState = {
  search: '',
}

// Tạo slice sử dụng createSlice từ Redux Toolkit
export const productSlide = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Hành động tìm kiếm sản phẩm
    searchProduct: (state, action) => {
      state.search = action.payload
    },
  },
})

// Xuất các hành động từ slice
export const { searchProduct } = productSlide.actions

// Xuất reducer từ slice
export default productSlide.reducer