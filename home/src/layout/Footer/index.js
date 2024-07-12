import React from 'react';
import './style.css';

//          component: 푸터 레이아웃            //
export default function Footer() {

    //      event handler: 노션 아이콘 버튼 클릭 이벤트 처리          //
    const onNotionIconButtonClickHandler = () => {
        window.open('https://dark-tungsten-846.notion.site/project-70073cbf5bd1478c91f7f7588201b2f7?pvs=4');
    };

    //      event handler: 깃 아이콘 버튼 클릭 이벤트 처리          //
    const onGitIconButtonClickHandler = () => {
        window.open('https://github.com/senselose/JJan');
    };

    //          render: 푸터 레이아웃 렌더링            //
    return (
    <div id='footer'>
        <div className='footer-container'>
            <div className='footer-top'>
                <div className='footer-logo-box'>
                    <div className='icon-box'>
                        <div className='icon whisky-icon'></div>
                    </div>
                    <div className='footer-logo-text'>{'酒酒총회'}</div>
                </div>
                <div className='footer-link-box'>
                    <div className='footer-email-link'>{'senseclose@gmail.com'}</div>
                    <div className='icon-button' onClick={onNotionIconButtonClickHandler}>
                        <div className='icon notion-icon'></div>
                    </div>
                    <div className='icon-button' onClick={onGitIconButtonClickHandler}>
                        <div className='icon git-icon'></div>
                    </div>
                </div>
            </div>
            <div className='footer-bottom'>
                <div className='footer-copyright'>{'Copyright © JUJU General Assembly'}</div>
            </div>
        </div>
    </div>
  )
}