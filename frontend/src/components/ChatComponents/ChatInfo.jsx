import { Modal } from "antd";

export default function ChatInfo({chat, setChatInfoIsOpen, isOpen}) {
    return (
        <Modal 
            isOpen={isOpen} 
            onCancel={() => setChatInfoIsOpen(false)}
            footer={null}
        >
            
        </Modal>
    )
}