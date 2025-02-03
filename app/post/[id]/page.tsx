import { PostPage } from '@/pageComponents/home/PostPage';
import { getPostData, getPostsData } from '@/post/getPostData';
import { Container } from '@/shared/ui/Container';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { id } = await params;
    const post = await getPostData({ id });

    const parentMetadata = ((await parent) || {}) as Metadata;

    return {
        ...parentMetadata,
        title: `${post.title} | Jobmeerkat Blog`,
        description: post.excerpt,
    };
}

export async function generateStaticParams() {
    const posts = await getPostsData();

    return posts.map((post) => ({
        id: post.id,
    }));
}

const Post = async ({ params }: Props) => {
    const { id } = await params;
    const post = await getPostData({ id });

    return (
        <Container>
            <PostPage post={post} />
        </Container>
    );
};

export default Post;
