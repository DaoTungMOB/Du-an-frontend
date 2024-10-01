import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { routes } from './routes';
import { isJsonString } from './utils';
import jwt_decode from 'jwt-decode';
import * as UserService from './services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, updateUser } from './redux/slides/userSlide';
import Loading from './components/LoadingComponent/Loading';

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // Đánh dấu đang loading
    setIsLoading(true);

    // Xử lý giải mã token và lấy thông tin người dùng khi component được render
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }

    // Kết thúc loading
    setIsLoading(false);
  }, []);

  // Hàm xử lý giải mã token và lấy dữ liệu từ storage
  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token');
    let decoded = {};

    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData);
    }

    return { decoded, storageData };
  };

  // Xử lý intercept request để kiểm tra và refresh token nếu cần
  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date();
    const { decoded } = handleDecoded();
    let storageRefreshToken = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storageRefreshToken);
    const decodedRefreshToken = jwt_decode(refreshToken);

    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken);
        config.headers['token'] = `Bearer ${data?.access_token}`;
      } else {
        dispatch(resetUser());
      }
    }

    return config;
  }, (err) => {
    return Promise.reject(err);
  });

  // Hàm lấy chi tiết người dùng và cập nhật trong Redux
  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }));
  };

  // Component chính của ứng dụng
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* Hiển thị Loading Component khi đang loading */}
      <Loading isLoading={isLoading}>
        {/* Sử dụng React Router để quản lý routing trong ứng dụng */}
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;

              return (
                // Render Route dựa trên thông tin từ mảng routes
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
