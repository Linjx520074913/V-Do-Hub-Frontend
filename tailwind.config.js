module.exports = {
    content: ['./packages/renderer/index.html', './packages/renderer/**/*.{vue,js,ts,jsx,tsx}', './node_modules/tw-elements/dist/js/**/*.js'],
    theme: {
        extend: {
            // ...
        },
    },
    plugins: [
        require('tw-elements/dist/plugin')
    ],
}