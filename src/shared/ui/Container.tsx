'use client';

import { PropsWithChildren } from 'react';
import styled from 'styled-components';

type ContainerProps = {
    $maxWidth?: string;
    $margin?: string;
};

const StyledContainer = styled.div<ContainerProps>`
    display: flex;
    flex-grow: 1;
    margin: ${(props) => props.$margin || '0'};
    max-width: ${(props) => props.$maxWidth || '960px'};
    width: 100%;
`;

export const Container = ({
    children,
    ...props
}: PropsWithChildren<ContainerProps>) => (
    <StyledContainer {...props}>{children}</StyledContainer>
);
