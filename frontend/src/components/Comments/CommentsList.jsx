import { useEffect, useState } from "react";
import InputWithIEmoji from "../ui/inputs/InputWithIEmoji";
import Comment from "./Comment";
import { SendOutlined } from "@ant-design/icons";
import getPostComments, { createComment } from "../../requests/api/posts";
import SendImagesCommentModal from "./SendImagesCommentModal";

export default function CommentsList({ postId, postInModalIsOpen, trigger }) {
    const [inputField, setInputField] = useState('');
    const [sendImagesModalIsOpen, setSendImagesModalIsOpen] = useState(false)
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (postInModalIsOpen) {
            getPostComments(postId).then(res => setComments(res))
        }
    }, [postInModalIsOpen, postId, trigger])

    async function submitCreate() {
        const form = new FormData();

        if (inputField.trim()) {
            form.append('text', inputField)
            await createComment(postId, form).then(res => {
                handleCreateComment(res)
                setInputField('')
            });
        }
    }

    function handleDeleteComment(commentId) {
		setComments(comments.filter((item) => item.id !== commentId));
    }

    function handleCreateComment(comment) {
		setComments([...comments, comment]);
	}

    return comments && (
        <div 
            style={{ 
                borderTop: '1px solid #252729',
                height: '700px',
                overflowY: 'auto',
                position: 'relative'
            }}
        >
            <div>
                {comments.map((comment) => (
                    <Comment 
                        key={comment.id} 
                        commentProps={comment} 
                        isReply={false} 
                        isLast={false} 
                        postId={postId}
                        isCreator={comment.author.id == localStorage.getItem('user_id')}
                        handleDeleteComment={handleDeleteComment}
                        handleCreateComment={handleCreateComment}
                    />
                ))}
            </div>

            <div className="sticky bottom-0 left-0 right-0 z-10 bg-[#17191b] p-[24px] pt-4 pb-4 rounded-bl-lg rounded-br-lg flex items-center justify-between">
                <SendImagesCommentModal 
                    isOpen={sendImagesModalIsOpen}
                    handleIsOpen={setSendImagesModalIsOpen} 
                    postId={postId}
                    handleCreateComment={handleCreateComment}
                />
                <div className="w-full mr-3">
                    <InputWithIEmoji 
                        fieldValue={inputField} 
                        setFieldValue={setInputField}
                    />
                </div>
                <button onClick={submitCreate}>
                    <SendOutlined
                        className="text-[20px] text-gray-500 cursor-pointer hover:text-gray-300"
                        onClick={null}
                    />
                </button>
            </div>
        </div>
    );
}
