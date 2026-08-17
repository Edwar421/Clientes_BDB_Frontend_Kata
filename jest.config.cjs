module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                diagnostics: false,
            },
        ],
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts", "<rootDir>/jest-setup.ts"],
};
