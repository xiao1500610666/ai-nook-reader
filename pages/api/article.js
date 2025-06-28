import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { remark } from 'remark';
import html from 'remark-html';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: '缺少文章 ID' });

  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = page.properties;

    const mdblocks = await n2m.pageToMarkdown(id);
    const mdString = n2m.toMarkdownString(mdblocks);
    const htmlContent = (await remark().use(html).process(mdString)).toString();

    const article = {
      id: page.id,
      title: props["标题"].title[0]?.plain_text || "无标题",
      tags: props["标签"]?.multi_select?.map((tag) => tag.name) || [],
      cover: props["封面图 URL"]?.rich_text[0]?.plain_text || "",
      bgm: props["音乐 URL"]?.rich_text[0]?.plain_text || "",
      html: htmlContent
    };

    res.status(200).json(article);
  } catch (err) {
    console.error("读取文章失败：", err);
    res.status(500).json({ error: '服务器错误' });
  }
}