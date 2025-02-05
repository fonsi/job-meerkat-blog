import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type PostData = {
    id: string;
    title: string;
    date: string;
    description: string;
    url: string;
};

export type PostDataWithContent = PostData & {
    content: string;
};

const postsDirectory = path.join(process.cwd(), 'posts');

const getIdFromFileName = (fileName: string): string =>
    fileName.replace(/\.md$/, '');

const makePostUrl = (id: string): string =>
    `${process.env.NEXT_PUBLIC_SITE_URL}/post/${id}`;

export const getPostsData = (): Array<PostData> => {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = getIdFromFileName(fileName);

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data,
            url: makePostUrl(id),
        } as PostData;
    });

    return allPostsData;
};

export const getSortedPostsData = (): Array<PostData> => {
    const allPostsData = getPostsData();

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
};

export const getPostData = async ({
    id,
}: {
    id: string;
}): Promise<PostDataWithContent> => {
    const fileNames = fs.readdirSync(postsDirectory);
    const postFileName = fileNames.find((fileName) => {
        const postId = getIdFromFileName(fileName);

        return postId === id;
    });

    if (!postFileName) {
        throw new Error(`File not found for id ${id}`);
    }

    const fullPath = path.join(postsDirectory, postFileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        id,
        ...matterResult.data,
        url: makePostUrl(id),
        content: contentHtml,
    } as PostDataWithContent;
};
