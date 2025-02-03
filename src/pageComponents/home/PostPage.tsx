import { PostDataWithContent } from '@/post/getPostData';
import { Post } from '@/post/ui/Post';

type Props = {
    post: PostDataWithContent;
};

export const PostPage = ({ post }: Props) => {
    return (
        <>
            <Post post={post} />
        </>
    );
};
