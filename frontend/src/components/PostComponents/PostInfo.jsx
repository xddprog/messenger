import { CommentOutlined, EllipsisOutlined, EyeOutlined, LikeOutlined, SendOutlined } from "@ant-design/icons";
import { Card, Dropdown, Image, Space } from "antd";
import EditPostModal from "./EditPostModal";


export default function PostInfo({
    postRef,
    post,
    postIsLiked,
    handleLike,
    countIsLiked,
    setEditModalIsOpen,
    editModalIsOpen,
    handleEdit,
    handeDelete,
    isCreator,
    setPost,
    postInModal,
    setPostInModal,
    setCounter
}) {
    const items = [
        {
            key: "editPost",
            label: <a onClick={handleEdit}>Редактировать</a>,
            isAdmin: true,
        },
        {
            key: "deletePost",
            label: <a onClick={handeDelete}>Удалить</a>,
            isAdmin: true,
        },
        {
            key: "sharePost",
            label: <a>Поделиться</a>,
            isAdmin: null,
        },
        {
            key: "saveToBookmarks",
            label: <a>В закладки</a>,
            isAdmin: null,
        },
    ].filter((item) => item.isAdmin === null || item.isAdmin === isCreator);

    return (
        <>
            <Card
                ref={postRef}
                className="mt-2 w-full border-none"
                style={{
                    borderBottomLeftRadius: !postInModal ? "0.5rem" : "0",
                    borderBottomRightRadius: !postInModal ? "0.5rem" : "0",
                }}
                title={
                    <div className="flex items-center justify-between mt-2 mb-2">
                        <div className="flex items-center">
                            <img
                                src={post.author.avatar}
                                alt="author-profile-photo"
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <a className="text-l">{post.author.username}</a>
                                <p className="m-0 text-sm font-medium text-gray-500">{post.created_at}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <EyeOutlined className="text-gray-500 mr-1" />
                            <p className="m-0 text-sm font-medium text-gray-500">{post.views}</p>
                            <Dropdown className="w-6 h-6 ml-3" menu={{ items }}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <EllipsisOutlined className="text-2xl" />
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                }
                cover={
                    <div className="flex">
                        {!!post.images &&
                            post.images.map((image) => (
                                <Image
                                    src={image}
                                    key={image}
                                    className="border-none object-cover h-full max-h-[500px] min-h-[500px]"
                                    width={`${post.images.length === 1 ? 100 : 100 / post.images.length}%`}
                                />
                            ))}
                    </div>
                }
                actions={[
                    <button
                        key="like-button"
                        className="bg-none border-none p-0 cursor-pointer"
                        onClick={handleLike}
                    >
                        <Space direction="horizontal" key="post-likes">
                            <LikeOutlined className={postIsLiked ? "text-green-500" : "text-gray-500"} />
                            <p className={`m-0 text-sm font-medium ${postIsLiked ? "text-green-500" : "text-gray-500"}`}>
                                {countIsLiked}
                            </p>
                        </Space>
                    </button>,
                    !postInModal && (
                        <button 
                            onClick={() => {
                                setPostInModal(true)
                                setCounter(prev => prev + 1)
                            }} 
                            key="comment-button"
                        >
                            <CommentOutlined />
                        </button>
                    ),
                    <SendOutlined key="send-button" className="w-10" />
                ].filter(Boolean)}
            >
                <p className="m-0">{post.description}</p>
            </Card>
            <EditPostModal
                isOpen={editModalIsOpen}
                handleIsOpen={setEditModalIsOpen}
                postImages={post.images}
                postDescription={post.description}
                postId={post.id}
                setPostAfterEdit={setPost}
            />
        </>
    );
}
