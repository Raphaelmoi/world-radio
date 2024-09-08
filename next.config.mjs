import pkg from 'webpack';
const { DefinePlugin } = pkg;

// export const reactStrictMode = true;
export function webpack(config) {
    config.plugins.push(
        new DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify('cesium'),
        }));
    return config;
}