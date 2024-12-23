import { Modal, Typography } from "antd";
import { deleteComment } from "../../requests/api/posts";

export default function DeleteCommentModal({isOpen, handleIsOpen, handleDeleteComment, commentId, postId}) {
    async function handleSubmit() {
        handleIsOpen(false)
        await deleteComment(postId, commentId).then(() =>{
            handleDeleteComment(commentId)
        })
        
    }

    return (
        <Modal
            centered 
            open={isOpen} 
            onCancel={() => handleIsOpen(false)}
            okText="Удалить"
            cancelText="Отмена"
            onOk={handleSubmit}
            title="Удаление сообщения"
        >
            <Typography.Text>Вы действительно хотите удалить сообщение?</Typography.Text>
        </Modal>
    );
}