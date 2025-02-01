import { PostsList } from '@/post/ui/PostsList';
import { PostData } from '@/post/getPostData';

type Props = {
    posts: PostData[];
};

export const HomePage = ({ posts }: Props) => {
    return (
        <>
            <PostsList posts={posts} />
        </>
    );
};
