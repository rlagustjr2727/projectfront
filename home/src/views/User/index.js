import React, { useState } from 'react';
import './style.css';

//                  component: 유저 화면 컴포넌트                   //
export default function User() {
    
    //                  component: 유저 화면 상단 컴포넌트                   //
    const UserTop = () => {

        //                  state: 마이페이지 여부 상태                 //
        const [isMyPage, setMyPage] = useState(false);
        
        //                  render: 유저 화면 상단 컴포넌트  렌더링                  //
        return (
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMyPage ? 
                    <div className='user-top-my-profile-image-box'></div> : 
                    <div className='user-top-profile-image-box'></div>
                    }
                    <div className='user-top-profile-image-box'></div>
                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMyPage ? 
                            <>
                            <div className='user-top-info-nickname'>{'나는 주코야키'}</div>
                            <div className='icon-button'>
                                <div className='icon edit-icon'></div>
                            </div>
                            </> : 
                            <div className='user-top-info-nickname'>{'나는 주코야키'}</div>
                            }
                        </div>
                        <div className='user-top-info-email'>{'email@email.com'}</div>
                    </div>
                </div>
            </div>
        );

    };

    //                  component: 유저 화면 하단 컴포넌트                   //
    const UserBottom = () => {
        
        //                  render: 유저 화면 하단 컴포넌트  렌더링                  //
        return (
            <div></div>
        );

    };

    //                  render: 유저 화면 컴포넌트 렌더링                   //
    return (
        <>
            <UserTop />
            <UserBottom />
        </>
    );
}