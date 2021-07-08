import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TSConfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: webpack.Configuration = {
    //Where files should be sent once they are bundled
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index.bundle.js'
    },
    //webpack 5 comes with devServer which loads in development mode
    devServer: {
        port: 3000,
        watchContentBase: true
    },
    //Rules of how webpack will take our files, complie & bundle them for the browser 
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"], 
        plugins: [ 
            new TSConfigPathsPlugin({
                configFile: './tsconfig.json'
            })
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: './src/index.html' }), new MiniCssExtractPlugin()],
}

export default config;
