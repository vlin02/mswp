const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

const DEVELOPMENT = {
    entry: {
        content: "./src/content.tsx"
    },
    devtool: "cheap-module-source-map",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            compilerOptions: { noEmit: false }
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "manifest.dev.json", to: "manifest.json" }]
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        path: path.join(__dirname, "dist/dev"),
        filename: "[name].js"
    }
}

const PRODUCTION = {
    entry: {
        content: "./src/content.tsx"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "manifest.prod.json", to: "manifest.json" }]
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        path: path.join(__dirname, "dist/prod"),
        filename: "[name].js"
    }
}


module.exports = (env = {}, argv) => {
    return argv.mode === "production" ? PRODUCTION : DEVELOPMENT
}