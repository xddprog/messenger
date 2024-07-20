import RegisterForm from "../../components/forms/RegisterForm";


export default function RegisterPage () {
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
                <RegisterForm/>
            </div>
         </div>
    )
}