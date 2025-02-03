'use client';

import Link from 'next/link';
import { PostData } from '../getPostData';
import styled from 'styled-components';
import { Colors } from '@/shared/styles/constants';

type Props = {
    posts: PostData[];
};

const StyledList = styled.ul`
    display: flex;
    flex-direction: column;
    list-style: none;
    margin-top: 48px;
`;

const StyledLink = styled(Link)`
    display: flex;
    gap: 12px;
`;

const PostTexts = styled.div`
    border-left: 1px solid ${Colors.mediumGrey};
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px 0 24px 12px;
`;

const PostTitle = styled.h2``;

const PostExcerpt = styled.p`
    font-size: 14px;
    line-height: 150%;
`;

const PostDate = styled.div`
    font-size: 12px;
    flex-grow: 1;
    flex-shrink: 0;
    margin-top: 32px;
`;

const Post = ({ post }: { post: PostData }) => {
    return (
        <li>
            <StyledLink href={post.url}>
                <PostDate>{post.date}</PostDate>
                <PostTexts>
                    <PostTitle>{post.title}</PostTitle>
                    <PostExcerpt>{post.excerpt}</PostExcerpt>
                </PostTexts>
            </StyledLink>
        </li>
    );
};

export const PostsList = ({ posts }: Props) => {
    return (
        <StyledList>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </StyledList>
    );
};
