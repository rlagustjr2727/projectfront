import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputBox from '../../components/InputBox';
import './RegisterForm.css';

function RegisterForm() {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userNickName, setUserNickName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userBirth, setUserBirth] = useState('');
    const [userPhoneNum, setUserPhoneNum] = useState('');

    const [isUserIdError, setUserIdError] = useState(false);
    const [userIdErrorMessage, setUserIdErrorMessage] = useState('');
    const [isUserNameError, setUserNameError] = useState(false);
    const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
    const [isUserNickNameError, setUserNickNameError] = useState(false);
    const [userNickNameErrorMessage, setUserNickNameErrorMessage] = useState('');
    const [isUserPasswordError, setUserPasswordError] = useState(false);
    const [userPasswordErrorMessage, setUserPasswordErrorMessage] = useState('');
    const [isUserEmailError, setUserEmailError] = useState(false);
    const [userEmailErrorMessage, setUserEmailErrorMessage] = useState('');
    const [isUserBirthError, setUserBirthError] = useState(false);
    const [userBirthErrorMessage, setUserBirthErrorMessage] = useState('');
    const [isUserPhoneNumError, setUserPhoneNumError] = useState(false);
    const [userPhoneNumErrorMessage, setUserPhoneNumErrorMessage] = useState('');

    const navigate = useNavigate();

    const emailRef = useRef(null);
    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordCheckRef = useRef(null);
    const nameRef = useRef(null);
    const birthRef = useRef(null);
    const nicknameRef = useRef(null);
    const telNumberRef = useRef(null);

    // event handler: 로그인 링크 클릭 이벤트 처리
    const onSignInLinkClickHandler = () => {
        navigate('/login');
      } 

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 입력값 검증
        let hasError = false;
        if (userId.trim() === '') {
            setUserIdError(true);
            setUserIdErrorMessage('아이디를 입력해주세요.');
            hasError = true;
        }
        if (userName.trim() === '') {
            setUserNameError(true);
            setUserNameErrorMessage('이름을 입력해주세요.');
            hasError = true;
        }
        if (userNickName.trim() === '') {
            setUserNickNameError(true);
            setUserNickNameErrorMessage('닉네임을 입력해주세요.');
            hasError = true;
        }
        if (userPassword.trim() === '' || userPassword.trim().length < 8) {
            setUserPasswordError(true);
            setUserPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
            hasError = true;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
            setUserEmailError(true);
            setUserEmailErrorMessage('유효한 이메일 주소를 입력해주세요.');
            hasError = true;
        }
        if (userBirth.trim() === '') {
            setUserBirthError(true);
            setUserBirthErrorMessage('생년월일을 입력해주세요.');
            hasError = true;
        }
        if (userPhoneNum.trim() === '' || !/^[0-9]{10,11}$/.test(userPhoneNum)) {
            setUserPhoneNumError(true);
            setUserPhoneNumErrorMessage('숫자만 입력해주세요. (하이픈 제외).');
            hasError = true;
        }
        if (hasError) return;

        try {
            const response = await axios.post("/api/users/register", {
                userId: userId,
                userName: userName,
                userNickName: userNickName,
                userPassword: userPassword,
                userEmail: userEmail,
                userBirth: userBirth,
                userPhoneNum: userPhoneNum,
            }, {
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                }
            });

            console.log('Registration successful:', response.data);
            navigate('/'); // 회원가입 성공 시 홈으로 이동
        } catch (error) {
            console.error('Failed to register:', error.message);
            // 실패 시 처리 로직 추가
        }
    };

    const handleInputChange = (setter, errorSetter, errorMessageSetter) => (event) => {
        setter(event.target.value);
        errorSetter(false);
        errorMessageSetter('');
    };

    return (
        <div id='register-wrapper'>
            <div className='register-container'>
                <div className='register-jumbotron-box'>
                    <div className='register-jumbotron-contents'>
                        <div className='register-jumbotron-text-box'>
                            <div className='register-jumbotron-text'></div>
                            <div className='register-jumbotron-text'></div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='register-card'>
                    <div className='register-card-box'>
                        <div className='register-card-top'>
                            <div className='register-card-title-box'>
                                <div className='register-card-title'>{'회원가입'}</div>
                            </div>
                            <InputBox
                                ref={idRef}
                                label='아이디*'
                                type='text'
                                placeholder='아이디를 입력해주세요'
                                value={userId}
                                onChange={handleInputChange(setUserId, setUserIdError, setUserIdErrorMessage)}
                                error={isUserIdError}
                                message={userIdErrorMessage}
                            />
                            <InputBox
                                ref={nameRef}
                                label='이름*'
                                type='text'
                                placeholder='이름을 입력해주세요'
                                value={userName}
                                onChange={handleInputChange(setUserName, setUserNameError, setUserNameErrorMessage)}
                                error={isUserNameError}
                                message={userNameErrorMessage}
                            />
                            <InputBox
                                ref={nicknameRef}
                                label='닉네임*'
                                type='text'
                                placeholder='닉네임을 입력해주세요'
                                value={userNickName}
                                onChange={handleInputChange(setUserNickName, setUserNickNameError, setUserNickNameErrorMessage)}
                                error={isUserNickNameError}
                                message={userNickNameErrorMessage}
                            />
                            <InputBox
                                ref={passwordRef}
                                label='비밀번호*'
                                type='password'
                                placeholder='비밀번호를 입력해주세요'
                                value={userPassword}
                                onChange={handleInputChange(setUserPassword, setUserPasswordError, setUserPasswordErrorMessage)}
                                error={isUserPasswordError}
                                message={userPasswordErrorMessage}
                            />
                            <InputBox
                                ref={emailRef}
                                label='이메일*'
                                type='email'
                                placeholder='이메일을 입력해주세요'
                                value={userEmail}
                                onChange={handleInputChange(setUserEmail, setUserEmailError, setUserEmailErrorMessage)}
                                error={isUserEmailError}
                                message={userEmailErrorMessage}
                            />
                            <InputBox
                                ref={birthRef}
                                label='생년월일*'
                                type='date'
                                placeholder='생년월일을 입력해주세요'
                                value={userBirth}
                                onChange={handleInputChange(setUserBirth, setUserBirthError, setUserBirthErrorMessage)}
                                error={isUserBirthError}
                                message={userBirthErrorMessage}
                            />
                            <InputBox
                                ref={telNumberRef}
                                label='핸드폰 번호*'
                                type='tel'
                                placeholder='핸드폰 번호를 입력해주세요'
                                value={userPhoneNum}
                                onChange={handleInputChange(setUserPhoneNum, setUserPhoneNumError, setUserPhoneNumErrorMessage)}
                                error={isUserPhoneNumError}
                                message={userPhoneNumErrorMessage}
                            />
                        </div>
                        <div className='register-card-bottom'>
                            <button type="submit" className='black-large-full-button'>{'회원가입'}</button>
                            <div className='register-description-box'>
                            <div className='register-description'>{'이미 계정이 있으신가요?'} <span className='register-description-link' onClick={onSignInLinkClickHandler} >{'로그인'}</span> </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
