import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {ConfigProvider, theme} from "antd";
import MainPage from './pages/mainPages/MainPage.jsx';
import RegisterPage from './pages/authPages/RegisterPage.jsx';
import LoginPage from './pages/authPages/LoginPage.jsx';
import PostsPage from './pages/mainPages/sidebarPages/PostsPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider theme={{
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: '#05d77e',
            colorBgContainer:'#17191b'
        }
    }}>
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path='/*' element={<MainPage/>}>
                    <Route path='posts' element={<PostsPage />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </ConfigProvider>
)