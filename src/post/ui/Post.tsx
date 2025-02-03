'use client';

import styled from 'styled-components';
import { PostDataWithContent } from '../getPostData';
import { Colors } from '@/shared/styles/constants';

type Props = {
    post: PostDataWithContent;
};

const StyledPost = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
    margin: 48px auto;
    padding: 0 12px;
`;

const Title = styled.h1`
    line-height: 120%;
`;

const Date = styled.p`
    color: ${Colors.mediumGrey};
    margin: 18px 0;
    font-size: 12px;
`;

const Content = styled.section`
    line-height: 150%;

    ul {
        list-style: none;
    }

    p {
        margin-top: 4px;
    }

    h2 {
        line-height: 120%;
        margin: 18px 0 12px;
    }

    h3 {
        line-height: 120%;
        margin: 16px 0 8px;
    }

    hr {
        margin: 24px 0;
        opacity: 0.2;
    }
`;

export const Post = ({ post }: Props) => {
    return (
        <StyledPost>
            <Title>{post.title}</Title>
            <Date>{post.date}</Date>
            <Content dangerouslySetInnerHTML={{ __html: post.content }} />
        </StyledPost>
    );
};
