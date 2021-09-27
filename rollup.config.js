import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import path from 'path'
import { copyFile } from 'fs/promises'

const production = !process.env.ROLLUP_WATCH

function serve () {
  let server

  function toExit () {
    if (server) server.kill(0)
  }

  return {
    writeBundle () {
      if (server) return
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    }
  }
}

function copy (fileIn, fileOut) {
  return {
    name: 'copy-and-watch',
    async buildStart() {
        !production && this.addWatchFile(fileIn);
    },
    async generateBundle() {
      copyFile(path.join(__dirname, 'src', fileIn), path.join(__dirname, 'public', fileOut))
    }
  }
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    postcss({
      extract: path.resolve('public/build/bundle.css')
    }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true
    }),
    commonjs(),
    copy('index.html', 'index.html'), 
    copy('index.html', '404.html'), 
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}
