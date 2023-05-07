
export type TSnippet = {
  snippetText: string;
  snippetImg?: string;
  tags?: string[];
  title: string;
  link?: string;
}

export interface INotionQueryResult {
  url: string,
  last_edited_time: string;
  properties: {
    Snippet: {
      id: string;
      rich_text: {
        plain_text: string;
      }[]
    },
    SnippetImg: {
      id: string;
      files: {
        file: {
          url: string;
        },
        name: string;
      }[];
    },
    Tags: {
      id: string;
      multi_select: {
        color: string;
        id: string;
        name: string;
      }[],
    },
    Title: {
      id: string;
      title: {
        plain_text: string; 
      }[]
    }
  }
}