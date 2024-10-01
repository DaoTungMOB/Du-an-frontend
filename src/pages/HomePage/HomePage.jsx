import React from "react";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import banner1 from "../../assets/images/1-1-1.png";
import banner2 from "../../assets/images/1-1-2.png";
import banner3 from "../../assets/images/1-1-3.png";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.jpg";
import slider3 from "../../assets/images/slider3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect } from "react";

const HomePage = () => {
  // Truy cập giá trị tìm kiếm từ Redux store
  const searchProduct = useSelector((state) => state?.product?.search);
  // Áp dụng debounce cho giá trị tìm kiếm
  const searchDebounce = useDebounce(searchProduct, 500);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);

  // Lấy dữ liệu tất cả sản phẩm với phân trang và tham số tìm kiếm
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  // Lấy dữ liệu tất cả loại sản phẩm
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  // Sử dụng react-query hook để lấy dữ liệu sản phẩm
  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  // Lấy dữ liệu tất cả loại sản phẩm khi component được mount
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  return (
    // Hiển thị component Loading trong khi dữ liệu đang được tải
    <Loading isLoading={isLoading || loading}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        {/* Render các component TypeProduct dựa trên mảng typeProducts */}
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>

      <div
        id="container"
        style={{ height: "100%", width: "100%", margin: "0 auto" }}
      >
        <div style={{ width: "100%", maxWidth: "100%", position: "relative" }}>
          {/* Render SliderComponent với một mảng hình ảnh */}
          <SliderComponent
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
            arrImages={[slider1, slider2, slider3]}
          />
          {/* Hiển thị banner và tiêu đề */}
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <h1 style={{ fontSize: "40px" }}>ĐIỆN THOẠI CHÍNH HÃNG</h1>
            <style>
              {`
            @media (max-width: 768px) {
                img {
                    width: 100%;
                    height: auto;
                }
            }
        `}
            </style>
            <img src={banner1} alt="banner" />
            <img src={banner2} alt="banner" />
            <img src={banner3} alt="banner" />
          </div>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <h1 style={{ fontSize: "40px" }}>
              CÁC SẢN PHẨM HIỆN CÓ TRONG CỬA HÀNG
            </h1>
            <h3>
              Hãy Nhanh Tay Mua Ngay Những Sản Phẩm Đang Bán Tại Cửa Hàng Với
              Giá Phải Chăng
            </h3>
          </div>
          <WrapperProducts>
            {products?.data?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              );
            })}
          </WrapperProducts>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
