import { readdir } from "node:fs/promises";
import { file, YAML } from "bun";

export type PostItem = {
  metadata: {
    title: string;
    slug?: string;
    created: Date;
  };
  content: string;
};

export const getPosts = async (): Promise<PostItem[]> => {
  const POSTS_DIR = process.env.POSTS_DIR || "content/posts";

  const postFiles = await readdir(POSTS_DIR);

  const posts: PostItem[] = [];

  for (const fileName of postFiles) {
    if (fileName.endsWith(".gmi")) {
      const filePath = `${POSTS_DIR}/${fileName}`;
      const fileContent = await file(filePath).text();

      // Simple front matter parsing (you can use a library like gray-matter for more complex cases)
      const [, metadataPart, ...contentParts] = fileContent.split("---");
      const content = contentParts.join("---").trim();

      const metadata = YAML.parse(metadataPart!.trim()) as PostItem["metadata"];
      posts.push({
        metadata: {
          title: metadata.title,
          slug: metadata.slug || fileName.replace(".gmi", ""),
          created: new Date(metadata.created),
        },
        content,
      });
    }
  }

  // Sort posts by creation date (newest first)
  posts.sort(
    (a, b) => b.metadata.created.getTime() - a.metadata.created.getTime(),
  );

  return posts;
};
