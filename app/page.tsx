import { HomePage } from '@/pageComponents/home/HomePage';
import { getSortedPostsData } from '@/post/getPostData';
import { Container } from '@/shared/ui/Container';

const Home = () => {
    const posts = getSortedPostsData();

    return (
        <Container>
            <HomePage posts={posts} />
        </Container>
    );
};

export default Home;
