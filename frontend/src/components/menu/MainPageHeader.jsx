import { Input,} from "antd";
import AppLogo from "../../logo/AppLogo";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMusicalNotesOutline } from "react-icons/io5";


export default function MainPageHeader() {

    return (
        <div style={{background:'#17191b', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, position: 'sticky'}}>
            <div style={{padding: '10px 270px', display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
                <div style={{display: 'flex', alignItems:'center'}}>
                    <div style={{ marginRight: '50px'}}> 
                        <AppLogo />
                    </div>
                    <div style={{ display:'flex',alignItems: 'center'}}>
                        <Input
                            placeholder="Поиск"
                            style={{width: '250px', backgroundColor: '#1e2022'}}
                            size={'middle'}
                        />
                        <div style={{display: 'flex', alignItems:'center'}}>
                            <button 
                                style={{
                                    background: 'none', 
                                    border: 'none', 
                                    padding: 0, 
                                    cursor: 'pointer'
                                }}
                            >
                                <IoMdNotificationsOutline 
                                    size={'30px'} 
                                    color="#fff" 
                                    style={{marginLeft: '30px', marginRight: '10px'}}
                                />
                            </button>
                            <button 
                                style={{
                                    background: 'none', 
                                    border: 'none', 
                                    padding: 0, 
                                    cursor: 'pointer',
                                }}
                            >
                                <IoMusicalNotesOutline size='27px' color="white" />
                            </button>   
                        </div>
                    </div>
                </div>
                
                <button 
                    style={{
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        cursor: 'pointer',
                    }}
                >
                    {/* <RxAvatar size='35px' color='white'/> */}
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="images/profile_example.jpg" style={{width:'35px', borderRadius: 50}}/>
                        {/* <MdOutlineExpandMore size='20px' color="white"/> */}
                    </div>
                </button>
            </div>
        </div>
    )
}