import { Image, message, Upload } from "antd";
import { useState } from "react";


const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});


export default function UploadImages({fileList, setFileList, maxCount}) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
		}
        
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

    function checkFileType(file) {
		const isImage =
			file.type === 'image/png' ||
			file.type === 'image/jpeg' ||
			file.type === 'image/jpg';
            
		if (!isImage) {
			message.error(`${file.name} не является фотографией`);
		}
        
		return isImage || Upload.LIST_IGNORE;
	}

	const dummyRequest = ({ onSuccess }) => {
		setTimeout(() => {
			onSuccess('ok');
		}, 0);
	};


	const onRemove = (file) => {
		const index = fileList.indexOf(file);
		const newFileList = fileList.slice();

		newFileList.splice(index, 1);
		setFileList(newFileList);
	};


    return (
        <>
        <Upload
            fileList={fileList}
            maxCount={maxCount}
            listType="picture-card"
            beforeUpload={checkFileType}
            onRemove={onRemove}
            customRequest={dummyRequest}
            onChange={(file) => setFileList(file.fileList)}
            onPreview={handlePreview}
        >
            Загрузить фото(макc. {maxCount})
        </Upload>
        {previewImage && 
            (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )
        }
        </>
    )
}