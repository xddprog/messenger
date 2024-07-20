import LoginForm from "../../components/forms/LoginForm";


export default function LoginPage() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
        }}>
            <div style={{
                width: '350px'
            }}>
                <LoginForm/>    
            </div>
        </div>
    )
}