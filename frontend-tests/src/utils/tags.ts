export enum Tags {
  Smoke = '@smoke',
  Regression = '@regression',
  Homepage = '@homepage',
  Admin = '@admin',
}

export const featureTag = (...tags: Tags[]): { tag: string[] } => ({ tag: tags });
