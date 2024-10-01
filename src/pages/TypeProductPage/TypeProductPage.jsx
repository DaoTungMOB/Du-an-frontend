// Trong TypeProductPage.jsx
import React, { useState, useEffect } from 'react';
import { Col, Pagination, Row } from 'antd';
import { useLocation } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import Loading from '../../components/LoadingComponent/Loading';
import CardComponent from '../../components/CardComponent/CardComponent';
import { WrapperNavbar, WrapperProducts, WrapperPagination } from './style';

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);

  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(type, page, limit);
    if (res?.status === 'OK') {
      setLoading(false);
      setProducts(res?.data);
      setPanigate({ ...panigate, total: res?.totalPage });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  };

  return (
    <Loading isLoading={loading}>
      <div style={{ width: '100%', background: '#efefef', minHeight: '100vh' }}>
        <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5em' }}>
          Tất Cả Các Sản Phẩm Trong Cửa Hàng
        </h1>
        <div style={{ width: '100%', maxWidth: '1570px', margin: '0 auto', padding: '20px', boxSizing: 'border-box' }}>
          <Row gutter={20}>
            <Col span={24} sm={{ span: 24 }} md={{ span: 18 }} style={{ display: 'flex', flexDirection: 'column' }}>
              <WrapperProducts>
                {products
                  ?.filter((pro) => {
                    if (searchDebounce === '') {
                      return pro;
                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                      return pro;
                    }
                  })
                  ?.map((product) => (
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
                  ))}
              </WrapperProducts>
              <WrapperPagination
                defaultCurrent={panigate.page + 1}
                total={panigate?.total}
                onChange={onChange}
                showSizeChanger={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
