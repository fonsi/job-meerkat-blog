import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
 
export type PostData = {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    url: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

const getIdFromFileName = (fileName: string): string =>  fileName.replace(/\.md$/, '');

const makePostUrl = (id: string): string => `/post/${id}`;
 
export const getSortedPostsData = (): Array<PostData> => {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = getIdFromFileName(fileName);
 
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents, {
      excerpt: true,
    });

    return {
      id,
      ...matterResult.data,
      excerpt: matterResult.excerpt,
      url: makePostUrl(id),
    } as PostData;
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export const getPostContent = ({ id }: { id: string }): string => {
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
  const matterResult = matter(fileContents, {
    excerpt: true,
  });

  return matterResult.content;
}