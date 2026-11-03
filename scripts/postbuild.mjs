import fs from 'node:fs'

if (fs.existsSync('dist/ui-components.css')) fs.renameSync('dist/ui-components.css', 'dist/styles.css')
fs.copyFileSync('src/theme.css', 'dist/theme.css')
fs.cpSync('src/assets/fonts', 'dist/assets/fonts', { recursive: true })
