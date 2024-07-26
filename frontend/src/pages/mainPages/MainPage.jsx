import {Outlet, useNavigate} from "react-router-dom";
import SideBar from "../../components/menu/SideBar";
import MainPageHeader from "../../components/menu/MainPageHeader";
import {useEffect} from "react";
import {getCurrentUser} from "../../requests/auth.js";



export default function MainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser().then(response => {
            const user = response.data;

            localStorage.setItem('user_id', user.id)
            localStorage.setItem('avatar', user.avatar)
        }).catch(
            error => error.status === 403 ? navigate('/login'): ''
        )
    }, []);

    return (
        <div style={{ backgroundColor: '#1e2022', height: '100vh' }}>
            <header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}>
                <MainPageHeader />
            </header>
            <div 
                style={{ 
                    display: 'flex',
                    paddingTop: '90px',
                    paddingLeft: 260,
                    paddingRight: 260,
                }}
            >
                <div style={{ width: '13%', position: 'fixed', top: '90px'}}>
                    <SideBar />
                </div>
                <div style={{ flex: 1, boxSizing: 'border-box', marginLeft: '23%', height: '100vh'}}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
