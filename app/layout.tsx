import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '图缩缩 - 免费在线图片压缩|格式转换|裁剪工具',
  description: '图缩缩(TuSuSuo)提供免费在线图片压缩、格式转换、裁剪工具，纯浏览器端处理，无需上传，保护隐私。',
  keywords: '图缩缩,图片压缩,图片格式转换,图片裁剪,在线图片工具,JPG压缩,PNG压缩,WebP转换,TuSuSuo',
  metadataBase: new URL('https://img.aiv.yn.cn'),
  alternates: {
    canonical: 'https://img.aiv.yn.cn',
  },
  openGraph: {
    title: '图缩缩 - 免费在线图片压缩|格式转换|裁剪工具',
    description: '图缩缩(TuSuSuo)提供免费在线图片压缩、格式转换、裁剪工具，纯浏览器端处理，无需上传，保护隐私。',
    url: 'https://img.aiv.yn.cn',
    siteName: '图缩缩',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
