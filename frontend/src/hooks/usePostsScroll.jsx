import { useEffect } from "react";
import { readPost } from "../requests/api/posts";

export default function usePostsScroll(handlePost, isRead, setIsRead, post, postRef) {
    
    useEffect(() => {
        if (!post || !postRef.current || isRead) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                readPost(post.id).then(handlePost(post));
                setIsRead(true);
              }
            });
          },
          { threshold: 0.5 }
        );
    
        if (postRef.current) {
          observer.observe(postRef.current);
        }
    
        return () => {
          if (postRef.current) {
            observer.unobserve(postRef.current);
          }
        };
    }, [isRead, post, postRef]);
}