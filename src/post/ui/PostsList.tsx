'use client';

import Link from 'next/link';
import { PostData } from '../getPostData';
import styled from 'styled-components';
import { Colors, Device } from '@/shared/styles/constants';

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
    flex-direction: column;
    gap: 4px;

    @media ${Device.tablet} {
        flex-direction: row;
        gap: 12px;
    }
`;

const PostTexts = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;

    @media ${Device.tablet} {
        border-left: 1px solid ${Colors.mediumGrey};
        padding: 24px 0 24px 12px;
    }
`;

const PostTitle = styled.h2``;

const PostDescription = styled.p`
    font-size: 14px;
    line-height: 150%;
`;

const PostDate = styled.div`
    color: ${Colors.mediumGrey};
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
                    <PostDescription>{post.description}</PostDescription>
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
