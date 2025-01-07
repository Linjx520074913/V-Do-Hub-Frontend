module.exports = {
    important: true,
    content: ['./packages/renderer/index.html', './packages/renderer/**/*.{vue,js,ts,jsx,tsx}', './node_modules/tw-elements/dist/js/**/*.js'],
    theme: {
        extend: {
            // ...
            colors:{
                'login-pink': '#FDECE5',
                'beige': '#FFF8EB',
                'main-color': '#E94902'
            }
        },
    },
    plugins: [
        require('tw-elements/dist/plugin')
    ],
}