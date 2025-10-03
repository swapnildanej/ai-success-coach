// This file serves as a fallback. Metro will automatically use:
// - openai.native.ts on React Native (iOS/Android)
// - openai.web.ts on Web
// This file is only used if neither platform-specific file exists
export * from './openai.native';
