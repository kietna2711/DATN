'use client';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { store, persistor } from './store/store';
import { App as AntdApp } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';

// 1. redux-persist làm gì?
// redux-persist giúp lưu lại state của Redux (giỏ hàng, user, v.v.) vào localStorage (hoặc sessionStorage).
// Khi bạn F5/làm mới trang hoặc chuyển trang, dữ liệu Redux không bị mất mà sẽ được lấy lại từ localStorage.
// 2. PersistGate hoạt động ra sao?
// PersistGate giống như một “cửa chờ”. Nó sẽ:
// Chờ cho tới khi Redux đã lấy lại (rehydrate) xong state từ localStorage.
// Sau đó mới render app của bạn (Header, Main, Footer, ...).
// Nếu không có PersistGate: khi reload, app sẽ render với state rỗng rồi mới cập nhật lại → dễ bị nháy, lỗi UI

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AntdApp>
          {children}
        </AntdApp>
      </PersistGate>
    </Provider>
  );
}