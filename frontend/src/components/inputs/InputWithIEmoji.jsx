import {Input, Popover} from "antd";
import EmojiPicker from "emoji-picker-react";
import {SmileOutlined} from "@ant-design/icons";


export default function InputWithIEmoji({fieldValue, setFieldValue, minRows} ) {
    function addEmojiToFieldValue(emoji) {
        setFieldValue((prevValue) => prevValue + emoji.emoji);
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Input.TextArea
                autoSize={{minRows: minRows, maxRows: 15}}
                value={fieldValue}
                onChange={(e) => {
                    setFieldValue(e.target.value)
                }}
                size={'middle'}
                placeholder="Введите..."
            />
            <Popover content={<EmojiPicker onEmojiClick={addEmojiToFieldValue}/>}>
                <SmileOutlined
                    style={{fontSize: '20px', cursor: 'pointer', marginLeft: '10px', color: '#fff'}}
                />
            </Popover>
        </div>
    )
}