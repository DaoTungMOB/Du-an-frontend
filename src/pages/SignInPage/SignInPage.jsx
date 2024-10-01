import React, { useEffect } from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import imageLogo from '../../assets/images/logo_main.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false) // Một state để kiểm soát việc hiển thị mật khẩu
  const location = useLocation() // Hook để lấy thông tin về đường dẫn hiện tại
  const [email, setEmail] = useState(''); // State để lưu trữ giá trị của ô nhập email
  const [password, setPassword] = useState(''); // State để lưu trữ giá trị của ô nhập mật khẩu
  const dispatch = useDispatch(); // Hook để gửi hành động (action) đến Redux store
  const user  = useSelector((state) => state.user) // Hook để lấy thông tin từ Redux store

  const navigate = useNavigate() // Hook để điều hướng (chuyển trang) trong React Router

  const mutation = useMutationHooks(
    data => UserService.loginUser(data) // Hook để xử lý việc gọi API đăng nhập người dùng
  )
  const { data, isLoading, isSuccess } = mutation // Lấy thông tin từ hook useMutationHooks

  useEffect(() => {
    if (isSuccess) {
      if(location?.state) {
        navigate(location?.state) // Nếu có đường dẫn trước đó, điều hướng đến đường dẫn đó
      } else {
        navigate('/') // Nếu không, điều hướng về trang chủ
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token)) // Lưu trữ access token vào localStorage
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token)) // Lưu trữ refresh token vào localStorage

      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token) // Giải mã access token để lấy thông tin người dùng
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token) // Gọi API để lấy thông tin chi tiết người dùng
        }
      }
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage) // Lấy refresh token từ localStorage
    const res = await UserService.getDetailsUser(id, token) // Gọi API để lấy thông tin chi tiết người dùng
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken })) // Cập nhật thông tin người dùng vào Redux store
  }

  const handleNavigateSignUp = () => {
    navigate('/sign-up') // Điều hướng đến trang đăng ký
  }

  const handleOnchangeEmail = (value) => {
    setEmail(value) // Cập nhật giá trị email khi người dùng thay đổi
  }

  const handleOnchangePassword = (value) => {
    setPassword(value) // Cập nhật giá trị mật khẩu khi người dùng thay đổi
  }

  const handleSignIn = () => {
    console.log('logingloin')
    mutation.mutate({
      email,
      password
    }) // Gửi yêu cầu đăng nhập với email và mật khẩu đã nhập
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Đăng Nhập</h1> {/* Tiêu đề trang đăng nhập */}
          <p>Đăng nhập tài khoản</p> {/* Mô tả trang đăng nhập */}
          <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} /> {/* Ô nhập email */}
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm
              placeholder="mật khẩu"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            /> {/* Ô nhập mật khẩu */}
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>} {/* Hiển thị thông báo lỗi nếu có */}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: '#94C6F9',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textbutton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }} 
            ></ButtonComponent>
          </Loading>
          <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p> {/* Đường dẫn đến trang đăng ký */}
        </WrapperContainerLeft>
      </div>
    </div >
  )
}

export default SignInPage