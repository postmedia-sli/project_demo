module.exports = {
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/**/*.spec.ts",
        "!<rootDir>/src/**/__*__/*",
    ],
    coverageDirectory: "build/reports/unit-test/coverage",
    coveragePathIgnorePatterns: [".*\.d\.ts"],
    coverageReporters: ["cobertura", "json", "lcov", "text"],
    moduleFileExtensions: [
        "js",
        "ts",
        "tsx",
    ],
    roots: [
        "<rootDir>/src",
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    verbose: true,
};
