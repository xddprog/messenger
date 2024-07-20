import { CommentOutlined, DislikeOutlined, EyeOutlined, LikeOutlined } from "@ant-design/icons";
import { Card, Image, Space } from "antd";


export default function Post({post}) {
    return (
        <Card 
            style={{
                marginTop: '10px', 
                height: '100%'
            }} 
            title={
                <div style={{display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '10px', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img 
                            src="images/post_avatar_example.jpg"
                            style={{ width: '40px', height: '40px', borderRadius: 50, marginRight: '15px'}}
                        />
                        <div>
                            <a style={{fontSize: 16}}>{post.author.username}</a>
                            <p style={{margin: 0, fontSize: 14, fontWeight: 500, color: '#6e7072'}}>{post.created_at}</p>
                        </div>

                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <EyeOutlined style={{color: '#6e7072', marginRight: '5px'}}/>
                        <p style={{margin: 0, fontSize: 14, fontWeight: 500, color: '#6e7072'}}>{post.views}</p>
                    </div>
                </div>
            }
            cover={
                <div style={{display: 'flex'}}>
                    {post.images.map(image => 
                        <Image src={image} key={image}  style={{ borderRadius: 0 }} width={'25%'}/>
                    )}
                </div>
            }
            actions={[
                <Space direction="horizontal" key={'post-likes'}>
                    <LikeOutlined key={'post-likes-icon'} />
                    <p style={{margin: 0, fontSize: 14, fontWeight: 500, color: '#6e7072'}}>
                        {post.likes}
                    </p>
                </Space>,
                <Space direction="horizontal" key={'post-likes'}>
                    <DislikeOutlined key={2}/>
                    <p style={{margin: 0, fontSize: 14, fontWeight: 400, color: '#6e7072'}}>
                        {post.dislikes}
                    </p>
                </Space>,
                <CommentOutlined key={3} width={40} />,
            ]}
        >
            <p style={{margin: 0}}>{post.description}</p>
        </Card>
    )
}