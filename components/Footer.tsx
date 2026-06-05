export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logo.svg" alt="图缩缩" width="28" height="28" />
          <span className="font-bold text-white">图缩缩</span>
        </div>
        <p className="text-sm mb-4">
          TuSuSuo.cn - 免费在线图片处理工具，纯浏览器端处理，保护您的隐私安全
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="/compress" className="hover:text-white transition-colors">
            图片压缩
          </a>
          <a href="/convert" className="hover:text-white transition-colors">
            格式转换
          </a>
          <a href="/crop" className="hover:text-white transition-colors">
            图片裁剪
          </a>
        </div>
        <p className="text-xs mt-6 text-gray-500">
          © {new Date().getFullYear()} 图缩缩 TuSuSuo.cn. 所有处理均在浏览器端完成。
        </p>
      </div>
    </footer>
  )
}
