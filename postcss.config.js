const postcssPurgecss = require('@fullhuman/postcss-purgecss')
const cssnano = require('cssnano')
const tailwindcss = require('tailwindcss')
const postcssPresetEnv = require('postcss-preset-env')

const production = !process.env.ROLLUP_WATCH

module.exports = {
  plugins: [
    tailwindcss,
    postcssPresetEnv({
      features: {
        // https://github.com/tailwindcss/tailwindcss/issues/1190
        'focus-within-pseudo-class': false
      }
    }),
    production && postcssPurgecss({
      content: ['./public/**/*.html', './src/**/*.html'],
      defaultExtractor: (content) => [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group)
    }),
    production && cssnano({
      preset: [
        'default',
        { discardComments: { removeAll: true } }
      ]
    })
  ].filter(Boolean)
}