const visionModels = ["gpt-4-vision-preview", "gpt-4o", "gpt-4o-2024-05-13"];

export const modelSupportsImages = (model: string) =>
  visionModels.includes(model);
