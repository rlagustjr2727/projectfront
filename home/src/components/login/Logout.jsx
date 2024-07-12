import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout({ onLogout }) {
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('/logout')
            .then(response => {
                onLogout();
                alert('로그아웃 되었습니다.');
                navigate('/');
            })
            .catch(error => {
                console.error('로그아웃 실패:', error);
                navigate('/');
            });
    }, [navigate, onLogout]);

    return null;
}

export default Logout;
