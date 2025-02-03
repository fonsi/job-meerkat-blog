'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { Colors, Device } from '@/shared/styles/constants';
import { LogoText } from '../image/LogoText';
import { OpenInNew } from '../image/icons/OpenInNew';

const StyledDiv = styled.div`
    align-items: center;
    background-color: ${Colors.brokenBlack};
    border-bottom: 1px solid ${Colors.mediumGrey};
    color: ${Colors.brokenWhite};
    display: flex;
    font-size: 24px;
    min-height: 54px;
    justify-content: center;
    padding: 8px 12px;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 960px;
    width: 100%;
`;

const LogoContainer = styled.div`
    display: flex;
`;

const StyledLink = styled(Link)`
    align-items: center;
    display: flex;
    font-size: 14px;
    gap: 10px;

    &:hover {
        text-decoration: none;
    }

    svg {
        height: 20px;
        width: 186px;
    }
`;

const BlogText = styled.span`
    border-left: 1px solid ${Colors.white};
    margin-top: 5px;
    padding-left: 8px;
`;

const HeaderLinks = styled.nav`
    font-size: 14px;

    svg {
        width: 18px;
        height: 18px;
    }
`;

const HeaderCta = styled(Link)`
    display: none;

    @media ${Device.tablet} {
        align-items: flex-start;
        display: flex;
        gap: 4px;
    }
`;

export const Header = () => (
    <StyledDiv>
        <Container>
            <LogoContainer>
                <StyledLink href="/">
                    <LogoText fill={Colors.white} />
                    <BlogText>BLOG</BlogText>
                </StyledLink>
            </LogoContainer>
            <HeaderLinks>
                <HeaderCta target="_blank" href="https://jobmeerkat.com">
                    <OpenInNew /> Find your dream job here!
                </HeaderCta>
            </HeaderLinks>
        </Container>
    </StyledDiv>
);
