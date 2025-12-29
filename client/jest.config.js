export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  moduleNameMapper: {
    "^../constants$": "<rootDir>/jest.constants.js",
    "^./constants$": "<rootDir>/jest.constants.js",
    "^./index$": "<rootDir>/src/services/index.ts",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [1343, 2339],
        },
        tsconfig: {
          allowJs: true,
          esModuleInterop: true,
          jsx: "react-jsx",
        },
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
