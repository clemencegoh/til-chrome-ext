
export type TEnvConfig = {
  notionToken: string;
  databaseId: string;
  openaiKey: string;
}

export const defaultEnvConfig: TEnvConfig = {
  notionToken: "",
  databaseId: "",
  openaiKey: "",
}