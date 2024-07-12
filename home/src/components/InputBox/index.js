import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './style.css';

//          components : Input Box 컴포넌트             //
const InputBox = forwardRef((props, ref) => {
    
    //          state : properties              //
    const { label, type, placeholder, value, error, icon, message } = props;
    const { onChange, onButtonClick, onKeyDown } = props;

    //          event handler ; input 키 이벤트 처리 함수              //
    const onKeyDownHandler = (event) => {
        if (!onKeyDown) return;
        onKeyDown(event);
    }

    //          render : Input Box 컴포넌트 렌더링            //
    return (
        <div className='inputbox'>
            <div className='inputbox-label'>{label}</div>
            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
                <input ref={ref} type={type} className='input' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDownHandler} />
                {onButtonClick !== undefined && 
                    <div className='icon-button' onClick={onButtonClick}>
                        {icon !== undefined && (<div className={`icon ${icon}`}></div>)}
                    </div>
                }
            </div>
            {message !== undefined && <div className='inputbox-message'>{message}</div>}
        </div>
    )
});

InputBox.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'password']).isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    icon: PropTypes.oneOf(['eye-light-off-icon', 'eye-light-on-icon', 'expand-right-light-icon']),
    onButtonClick: PropTypes.func,
    message: PropTypes.string,
    onKeyDown: PropTypes.func
};

export default InputBox;