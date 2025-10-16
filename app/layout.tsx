import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import StyledComponentsRegistry from '@/shared/styles/registry';
import { Footer } from '@/shared/ui/Footer';
import { Header } from '@/shared/ui/Header';
import { Main } from '@/shared/ui/Main';
import { Page } from '@/shared/ui/Page';
import { delaGothicOne } from '@/shared/font/constants';
import { isProd } from '@/shared/environment/isProd';
import { getSiteUrl } from '@/shared/environment/getSiteUrl';

const UMAMI_ID = process.env.UMAMI_ID;

export const metadata: Metadata = {
    title: 'Jobmeerkat Blog',
    description:
        'JobMeerkat Blog: Your go-to resource for job search tips, resume writing, career advice, and industry insights. Get expert guidance to land your dream job and grow your career!',
    robots: {
        index: isProd,
        follow: isProd,
    },
    alternates: {
        canonical: getSiteUrl(),
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${delaGothicOne.variable}`}>
                {isProd && UMAMI_ID ? (
                    <Script
                        strategy="afterInteractive"
                        src="https://cloud.umami.is/script.js"
                        data-website-id={UMAMI_ID}
                    />
                ) : null}
                <StyledComponentsRegistry>
                    <Page>
                        <Header />
                        <Main>{children}</Main>
                        <Footer />
                    </Page>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
