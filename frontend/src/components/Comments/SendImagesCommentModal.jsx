import { UploadOutlined } from "@ant-design/icons";
import { Form, Modal } from "antd";
import { useState } from "react";
import InputWithIEmoji from "../ui/inputs/InputWithIEmoji";
import UploadImages from "../ui/uploads/UploadImages";
import { createComment } from "../../requests/api/posts";

export default function SendImagesCommentModal({ isOpen, handleIsOpen, postId, handleCreateComment, parentId}) {
    const form = Form.useForm()
    const [fileList, setFileList] = useState([]);
    const [commentInputValue, setCommentInputValue] = useState('');

    function closeModal() {
        form[0].resetFields();
        setCommentInputValue('');
        setFileList([]);
        handleIsOpen(false);
    }

    async function submitSendImagesMessage() {
        try {
            const form = new FormData();

            fileList.forEach(file => {
                form.append('images', file.originFileObj);

            });
            form.append('text', commentInputValue);
            if (parentId) {
                form.append('parent', parentId);
            }
            
            await createComment(postId, form).then(res => {
                handleCreateComment(res)
                closeModal()
            });

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <UploadOutlined
                key={"uploadImages"}
                className="text-[20px] text-gray-500 mr-[10px] cursor-pointer hover:text-gray-300"
                onClick={() => handleIsOpen(true)}
            />
            <Modal
                key={"sendImages"}
                centered
                open={isOpen}
                onCancel={() => handleIsOpen(false)}
                onOk={submitSendImagesMessage}
                okText="Отправить"
                cancelText="Отмена"
                title="Отправить комментария с изображениями"
            >
                <Form form={form[0]} className="mt-5">
                    <Form.Item name="message" label="Комментарий">
                        <InputWithIEmoji
                            fieldValue={commentInputValue}
                            setFieldValue={setCommentInputValue}
                            minRows={3}
                        />
                    </Form.Item>
                    <Form.Item name="images" label="Изображения">
                        <UploadImages fileList={fileList} setFileList={setFileList} maxCount={9} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}