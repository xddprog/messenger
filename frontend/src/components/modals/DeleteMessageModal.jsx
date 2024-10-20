import { Modal, Typography } from "antd";

export default function DeleteMessageModal({isOpen, handleIsOpen, handleDelete, message}) {
    async function handleDeleteMessage() {
        handleIsOpen(false)
        handleDelete(message)
    }

    return (
        <Modal
            centered 
            open={isOpen} 
            onCancel={() => handleIsOpen(false)}
            okText="Удалить"
            cancelText="Отмена"
            onOk={handleDeleteMessage}
            key={message.id}
            title="Удаление сообщения"
        >
            <Typography.Text>Вы действительно хотите удалить сообщение?</Typography.Text>
        </Modal>
    );
}