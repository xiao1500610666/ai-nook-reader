import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: '发布时间', direction: 'descending' }]
    });

    const articles = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props["标题"].title[0]?.plain_text || "无标题",
        tags: props["标签"]?.multi_select?.map((tag) => tag.name) || [],
        cover: props["封面图 URL"]?.rich_text[0]?.plain_text || "",
        bgm: props["音乐 URL"]?.rich_text[0]?.plain_text || ""
      };
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error('查询 Notion 失败', error);
    res.status(500).json({ error: '内部错误' });
  }
}