import { useState, useNavigate } from "react";

function AuthChecker() {
    const [userIsAuthorized, setUserIsAuthorized] = useState(false);
    const navigate = useNavigate();

    if (!userIsAuthorized) {
        localStorage.removeItem('token')
        navigate('/login')
    }
}

export default AuthChecker