import Link from 'next/link'
import ToolCard from '@/components/ToolCard'

const tools = [
  {
    title: '图片压缩',
    description: '支持JPG、PNG、WebP格式，可调节压缩质量，大幅减小文件体积',
    href: '/compress',
    icon: '🗜️',
  },
  {
    title: '格式转换',
    description: 'JPG、PNG、WebP格式互相转换，一键完成',
    href: '/convert',
    icon: '🔄',
  },
  {
    title: '图片裁剪',
    description: '自定义尺寸裁剪，支持预设比例，精确控制裁剪区域',
    href: '/crop',
    icon: '✂️',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            图缩缩 - 免费在线图片工具
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            纯浏览器端处理，无需上传服务器，保护您的隐私安全
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-700 shadow-sm">
              🔒 隐私安全
            </span>
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-700 shadow-sm">
              ⚡ 极速处理
            </span>
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-700 shadow-sm">
              🆓 完全免费
            </span>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            选择您需要的工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            为什么选择我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-semibold text-lg mb-2">隐私优先</h3>
              <p className="text-gray-600">所有处理均在浏览器端完成，图片不会上传到任何服务器</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold text-lg mb-2">多端适配</h3>
              <p className="text-gray-600">完美支持手机、平板、电脑等各种设备</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2">简单易用</h3>
              <p className="text-gray-600">拖拽上传，一键处理，所见即所得</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
