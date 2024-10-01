import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productReducer from './slides/productSlide';
import userReducer from './slides/userSlide';
import orderReducer from './slides/orderSlide';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Cấu hình cho Redux Persist
const persistConfig = {
  key: 'root',          // Khóa cho dữ liệu được lưu trữ trong localStorage
  version: 1,            // Phiên bản của cấu trúc dữ liệu
  storage,               // Đối tượng lưu trữ (ở đây sử dụng localStorage)
  blacklist: ['product', 'user'],  // Danh sách các reducer không được lưu trữ
};

// Kết hợp tất cả các reducer thành một reducer chính
const rootReducer = combineReducers({
  product: productReducer,  // Reducer quản lý trạng thái sản phẩm
  user: userReducer,        // Reducer quản lý trạng thái người dùng
  order: orderReducer,      // Reducer quản lý trạng thái đơn hàng
});

// Sử dụng Redux Persist để bảo vệ reducer chính khỏi việc mất dữ liệu sau khi refresh trang
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo Redux store với cấu hình đã được xác định
export const store = configureStore({
  reducer: persistedReducer,  // Sử dụng reducer đã được bảo vệ bởi Redux Persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Tùy chỉnh kiểm tra tính tuân thủ của dữ liệu (serializableCheck)
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Tạo đối tượng persistor để sử dụng Redux Persist
export let persistor = persistStore(store);

//Mã Redux trên được sử dụng để quản lý trạng thái ứng dụng trong React bằng thư viện Redux
//và để lưu trữ một số trạng thái quan trọng vào localStorage sử dụng Redux Persist
