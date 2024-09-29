const visionModels = [
  "chatgpt-4o-latest",
  "gpt-4o",
  "gpt-4o-2024-05-13",
  "gpt-4o-2024-08-06",
  "gpt-4o-mini",
  "gpt-4o-mini-2024-07-18",
];

export const modelSupportsImages = (model: string) =>
  visionModels.includes(model);
