import { DownOutlined, EllipsisOutlined, SendOutlined, UpOutlined } from "@ant-design/icons";
import { Card, Dropdown } from "antd";
import { useState } from "react";
import InputWithIEmoji from "../ui/inputs/InputWithIEmoji";
import { createComment, updateComment } from "../../requests/api/posts";
import DeleteCommentModal from "./DeleteCommentModal";
import SendImagesCommentModal from "./SendImagesCommentModal";
import ImagesList from "../ui/list/ImagesList";
import { useNavigate } from "react-router-dom";

export default function Comment({
    commentProps,
    replyMargin,
    isReply,
    isLast,
    postId,
    isCreator,
    handleDeleteComment,
    handleCreateComment,
}) {
    const [showReplies, setShowReplies] = useState(false);
    const [replyInputIsOpen, setReplyInputIsOpen] = useState(false);
    const [replyInput, setReplyInput] = useState('');
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [commentIsEditing, setCommentIsEditing] = useState(false);
    const [commentNewValue, setCommentNewValue] = useState(commentProps.text);
    const [comment, setComment] = useState(commentProps);
    const [sendImagesModalIsOpen, setSendImagesModalIsOpen] = useState(false);
    const navigate = useNavigate()

    const items = [
        {
            key: 'reply',
            label: <a onClick={handleReplyButton}>Ответить</a>,
            isCreator: null,
        },
        {
            key: 'send',
            label: <a>Поделиться</a>,
            isCreator: null,
        },
        {
            key: 'edit',
            label: <a onClick={() => setCommentIsEditing(true)}>Редактировать</a>,
            isCreator: true,
        },
        {
            key: 'delete',
            label: <a onClick={() => setDeleteModalIsOpen(true)}>Удалить</a>,
            danger: true,
            isCreator: true,
        },
    ].filter((item) => item.isCreator === null || item.isCreator === isCreator);

    function handleReplyButton() {
        setReplyInput(`${comment.author.username}, `);
        setReplyInputIsOpen(!replyInputIsOpen);
    }

    function handleDeleteReply(replyId) {
        setComment((prevComment) => ({
            ...prevComment,
            replies: prevComment.replies.filter((item) => item.id !== replyId),
        }));
    }

    function handleReplyComment(res) {
        setReplyInput('');
        setComment({ ...comment, replies: [...comment.replies, res] });
    }

    async function submitReply() {
        const form = new FormData();

        if (replyInput.trim()) {
            form.append('text', replyInput);
            form.append('parent', comment.id);
            
            await createComment(postId, form).then((res) => {
                handleReplyComment(res);
                setReplyInputIsOpen(false);
            });
        }
    }

    async function handleSubmitEditComment(e) {
        const formData = new FormData();
        formData.append('text', commentNewValue);

        if (e.key === 'Enter') {
            if (commentNewValue !== comment.text) {
                setCommentIsEditing(false);
                await updateComment(postId, comment.id, formData).then((res) => {
                    setComment(res);
                });
            }
        } else if (e.key === 'Escape') {
            setCommentIsEditing(false);
        }
    }

    function handleClickCommentAuthor() {
		if (comment.author.id == localStorage.getItem("user_id")) {
			return navigate(`/profile`)
		}
		return navigate(
			`/users/${comment.author.id}`,
			{
				currentUserProfile: false, 
			}
		)
	}

    return (
        <>
            <Card
                className="custom-card"
                style={{
                    border: 'none',
                    borderRadius: 0,
                    borderBottom: (isReply && !isLast) || !isReply ? '1px solid #252729' : 'none',
                }}
            >
                <div className={`flex flex-col w-full pr-[24px] ml-[${replyMargin}]`}>
                    <div className="flex items-start justify-between w-full">
                        <div className="flex items-start flex-1">
                            <a onClick={handleClickCommentAuthor}>
                                <img
                                    src={comment.author.avatar}
                                    alt="author-profile-photo"
                                    className="w-7 h-7 rounded-full mr-3"
                                />
                            </a>
                            <div className="flex flex-col items-start">
                                <a className="text-l m-0">{comment.author.username}</a>
                                {comment.images[0] && (
                                    <div className="mr-2">
                                        <ImagesList images={comment.images} />
                                    </div>
                                )}
                                {commentIsEditing ? (
                                    <div className="">
                                        <InputWithIEmoji
                                            minRows={1}
                                            fieldValue={commentNewValue}
                                            setFieldValue={setCommentNewValue}
                                            enterHandler={handleSubmitEditComment}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm">{comment.text}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between ml-3 flex-shrink-0">
                            <Dropdown className="w-6 h-6" menu={{ items }}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <EllipsisOutlined className="text-2xl" />
                                </a>
                            </Dropdown>
                            <p className="m-0 text-xs font-medium text-gray-500">{comment.created_at}</p>
                        </div>
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                        <button onClick={() => setShowReplies(!showReplies)}>
                            <div className="flex items-center text-gray-500">
                                {showReplies ? <UpOutlined className="mr-1" /> : <DownOutlined className="mr-1" />}
                                <p className="text-xs">
                                    {showReplies ? 'Скрыть ответы' : `Показать ответы (${comment.replies.length})`}
                                </p>
                            </div>
                        </button>
                    )}
                    <div
                        style={{ display: replyInputIsOpen ? 'flex' : 'none' }}
                        className="w-full mt-2 gap-2 flex items-center"
                    >
                        <SendImagesCommentModal
                            isOpen={sendImagesModalIsOpen}
                            handleIsOpen={setSendImagesModalIsOpen}
                            postId={postId}
                            handleCreateComment={replyInputIsOpen ? handleReplyComment : handleCreateComment}
                            parentId={comment.id}
                        />
                        <div className="w-full">
                            <InputWithIEmoji fieldValue={replyInput} setFieldValue={setReplyInput} />
                        </div>
                        <button onClick={submitReply}>
                            <SendOutlined className="text-[20px] text-gray-500 cursor-pointer hover:text-gray-300" />
                        </button>
                    </div>
                </div>
                {comment.replies && comment.replies.length > 0 && (
                    <div>
                        {showReplies &&
                            comment.replies.map((reply, index) => (
                                <Comment
                                    key={reply.id}
                                    commentProps={reply}
                                    replyMargin={replyMargin + 30}
                                    isReply={true}
                                    isLast={comment.replies.length - 1 === index}
                                    postId={postId}
                                    isCreator={reply.author.id === localStorage.getItem('user_id')}
                                    handleDeleteComment={() => handleDeleteReply(reply.id)}
                                />
                            ))}
                    </div>
                )}
            </Card>
            <DeleteCommentModal
                commentId={comment.id}
                isOpen={deleteModalIsOpen}
                handleIsOpen={setDeleteModalIsOpen}
                handleDeleteComment={handleDeleteComment}
                postId={postId}
            />
        </>
    );
}
