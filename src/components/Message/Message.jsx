import { message } from "antd";

const success = (mes = 'Thành công') => {
    message.success(mes);
};

const error = (mes = 'lỗi') => {
    message.error(mes);
};

const warning = (mes = 'cảnh báo') => {
    message.warning(mes);
};

export { success, error, warning }