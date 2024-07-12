// 로그인 상태 확인하고, 로그인되어 있지 않으면 로그인 페이지로 리디렉션 하는 컴포넌트
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
