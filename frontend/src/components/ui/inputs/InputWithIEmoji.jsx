import {Input, Popover} from "antd";
import EmojiPicker from "emoji-picker-react";
import {SmileOutlined} from "@ant-design/icons";


export default function InputWithIEmoji({fieldValue, setFieldValue, minRows, enterHandler} ) {
    function addEmojiToFieldValue(emoji) {
        setFieldValue((prevValue) => prevValue + emoji.emoji);
    }

    return (
        <div className="flex justify-between">
            <Input.TextArea
                autoSize
                minRows={minRows}
                maxRows={15}
                value={fieldValue}
                onChange={(e) => {
                    setFieldValue(e.target.value)
                }}
                size={'middle'}
                placeholder="Введите..."
                onKeyDown={enterHandler ? enterHandler: null}
            />
            <Popover content={<EmojiPicker onEmojiClick={addEmojiToFieldValue}/>}>
                <SmileOutlined className="text-[#fff] cursor-pointer ml-[10px] text-[20px] hover:text-[#b9b9b9]"/>
            </Popover>
        </div>
    )
}