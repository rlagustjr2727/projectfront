import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import InputBox from '../InputBox';

function LoginForm({ setIsLoggedIn }) { // setIsLoggedIn props 추가

    // state: 아이디 요소 참조 상태
    const idRef = useRef(null);

    // state: 패스워드 요소 참조 상태
    const passwordRef = useRef(null);

    // state: 패스워드 타입 상태
    const [passwordType, setPasswordType] = useState('password');
    
    // state: 패스워드 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState('eye-light-off-icon');

    const [loginData, setLoginData] = useState({ userId: '', userPassword: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', loginData); // 상대 경로 사용
            alert(response.data);
            setIsLoggedIn(true); // 로그인 성공 시 상태 변경
            navigate('/'); // 로그인 성공 시 홈으로 이동
        } catch (error) {
            alert("Login failed!");
        }
    };

    // event handler: 회원가입 링크 클릭 이벤트 처리
    const onSignUpLinkClickHandler = () => {
        navigate('/register'); 
    }

    // event handler: 아이디 input 키 다운 이벤트 처리
    const onIdKeyDownHandler = (event) => {
        if (event.key !== 'Enter') return;
        if (!passwordRef.current) return;
        passwordRef.current.focus();
      }
      
    // event handler: 패스워드 input 키 다운 이벤트 처리
    const onPasswordKeyDownHandler = (event) => {
        if (event.key !== 'Enter') return;
        handleSubmit(event);
    }

    // event handler: 패스워드 버튼 클릭 이벤트 처리
    const onPasswordButtonClickHandler = () => {
        if (passwordType === 'text') {
          setPasswordType('password');
          setPasswordButtonIcon('eye-light-off-icon');
        } else {
          setPasswordType('text');
          setPasswordButtonIcon('eye-light-on-icon');
        }
      }

    return (
        <div id='auth-wrapper'>
            <div className='auth-container'>
                <div className='auth-jumbotron-box'>
                    <div className='auth-jumbotron-contents'>
                        <div className='auth-logo-icon'></div>
                        <div className='auth-jumbotron-text-box'>
                            <div className='auth-jumbotron-text'>{'환영합니다.'}</div>
                            <div className='auth-jumbotron-text'>{'酒酒총회 입니다'}</div>
                        </div>
                    </div>
                 </div>
            <div className='auth-card'>
                <div className='auth-card-box'>
                <div className='auth-card-top'>
                    <div className='auth-card-title-box'>
                    <div className='auth-card-title'>{'로그인'}</div>
                    </div>
                        <InputBox label='아이디*' name="userId" ref={idRef} type="text" value={loginData.userId} onChange={handleChange} placeholder="아이디를 입력해주세요." onKeyDown={onIdKeyDownHandler} />
                        <InputBox label='비밀번호*' name="userPassword" ref={passwordRef} type={passwordType} value={loginData.userPassword} onChange={handleChange} placeholder="비밀번호를 입력해주세요" onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler} />
                    </div>
                    <div className='auth-card-bottom'>
                        <button className='black-large-full-button' onClick={handleSubmit}>{'로그인'}</button> {/* 버튼 클릭 핸들러 수정 */}
                        <div className='auth-description-box'>
                            <div className='auth-description'>{'신규 사용자이신가요?'}<span className='auth-description-link' onClick={onSignUpLinkClickHandler}>{'회원가입'}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
}

export default LoginForm;
