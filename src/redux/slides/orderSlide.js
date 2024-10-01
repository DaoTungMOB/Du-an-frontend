import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo trạng thái ban đầu của slice
const initialState = {
  orderItems: [],
  orderItemsSlected: [],
  shippingAddress: {},
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: '',
  isSucessOrder: false,
}

// Tạo slice sử dụng createSlice từ Redux Toolkit
export const orderSlide = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Hành động thêm sản phẩm vào đơn hàng
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
      if (itemOrder) {
        if (itemOrder.amount <= itemOrder.countInstock) {
          itemOrder.amount += orderItem?.amount
          state.isSucessOrder = true
          state.isErrorOrder = false
        }
      } else {
        state.orderItems.push(orderItem)
      }
    },
    // Hành động reset đơn hàng
    resetOrder: (state) => {
      state.isSucessOrder = false
    },
    // Hành động tăng số lượng sản phẩm trong đơn hàng
    increaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
      const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct)
      itemOrder.amount++
      if (itemOrderSelected) {
        itemOrderSelected.amount++
      }
    },
    // Hành động giảm số lượng sản phẩm trong đơn hàng
    decreaseAmount: (state, action) => {
      const { idProduct } = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
      const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct)
      itemOrder.amount--
      if (itemOrderSelected) {
        itemOrderSelected.amount--
      }
    },
    // Hành động xóa sản phẩm khỏi đơn hàng
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload

      const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
      const itemOrderSeleted = state?.orderItemsSlected?.filter((item) => item?.product !== idProduct)

      state.orderItems = itemOrder
      state.orderItemsSlected = itemOrderSeleted
    },
    // Hành động xóa tất cả sản phẩm trong đơn hàng
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload

      const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
      const itemOrdersSelected = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
      state.orderItems = itemOrders
      state.orderItemsSlected = itemOrdersSelected
    },
    // Hành động chọn các sản phẩm trong đơn hàng
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload
      const orderSelected = []
      state.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order)
        }
      })
      state.orderItemsSlected = orderSelected
    },
  },
})

// Xuất các hành động từ slice
export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
  resetOrder,
} = orderSlide.actions

// Xuất reducer từ slice
export default orderSlide.reducer