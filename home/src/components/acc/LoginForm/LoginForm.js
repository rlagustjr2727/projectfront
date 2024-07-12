// components/LoginForm/LoginForm.js

import React from 'react';

const LoginForm = () => {

    const Rest_api_key='777041d93c8d8ca676a182a47643e816' 
    const redirect_uri = 'http://localhost:3000/auth'
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    const handleLogin = ()=>{
        window.location.href = kakaoURL
    }
    return(
    <div>
        {/* 여기에 로그인 폼을 추가 */}
        <img src={"images/kakao.png"} alt="카카오 이미지" onClick={handleLogin}/>
    </div>
  );
}

export default LoginForm;
