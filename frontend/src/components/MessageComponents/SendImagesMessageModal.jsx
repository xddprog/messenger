import { UploadOutlined } from "@ant-design/icons";
import { Form, Modal } from "antd";
import { useState } from "react";
import InputWithIEmoji from "../ui/inputs/InputWithIEmoji";
import UploadImages from "../ui/uploads/UploadImages";

export default function SendImagesMessageModal({ isOpen, handleIsOpen, ws }) {
    const form = Form.useForm()
    const [fileList, setFileList] = useState([]);
    const [messageInputValue, setMessageInputValue] = useState('');

    async function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    function closeModal() {
        form[0].resetFields();
        setMessageInputValue('');
        setFileList([]);
        handleIsOpen(false);
    }

    async function submitSendImagesMessage() {
        try {
            const files = [];
            for (let i = 0; i < fileList.length; i++) {
                const base64File = await getBase64(fileList[i].originFileObj);
                files.push({
                    content_type: fileList[i].type,
                    file: base64File
                });
            }

            ws.send(JSON.stringify({
                type: 'create',
                message: messageInputValue,
                images: files
            }));

            closeModal()
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <UploadOutlined
                key={"uploadImages"}
                className="text-[20px] text-white mr-[10px] cursor-pointer hover:text-[#b9b9b9]"
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
                title="Отправить сообщение с изображениями"
            >
                <Form form={form[0]} className="mt-5">
                    <Form.Item name="message" label="Сообщение">
                        <InputWithIEmoji
                            fieldValue={messageInputValue}
                            setFieldValue={setMessageInputValue}
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