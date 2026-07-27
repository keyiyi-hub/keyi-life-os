// 简易 SPA 静态服务器 — 处理 BrowserRouter 的路由回退
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 8000
const ROOT = path.join(__dirname, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
}

const server = http.createServer((req, res) => {
  try {
    const url = decodeURIComponent(req.url.split('?')[0])
    let filePath = path.join(ROOT, url)

    // 防止目录穿越
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    // 如果是目录或不存在 .html 后缀,尝试 index.html
    if (url === '/' || url === '') {
      filePath = path.join(ROOT, 'index.html')
    } else if (!fs.existsSync(filePath)) {
      // SPA fallback: 所有未知路由回退到 index.html
      filePath = path.join(ROOT, 'index.html')
    } else if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404)
      res.end('Not Found')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    fs.createReadStream(filePath).pipe(res)
  } catch (e) {
    res.writeHead(500)
    res.end('Server Error')
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Life OS] 静态服务运行于 http://0.0.0.0:${PORT}`)
})
