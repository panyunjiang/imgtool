'use client'

import { useState, useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImagePreview from '@/components/ImagePreview'
import imageCompression from 'browser-image-compression'

export default function CompressPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string>('')
  const [compressedPreview, setCompressedPreview] = useState<string>('')
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
  const [quality, setQuality] = useState(0.7)
  const [isProcessing, setIsProcessing] = useState(false)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const handleImageSelect = useCallback(async (file: File) => {
    setOriginalFile(file)
    setOriginalPreview(URL.createObjectURL(file))
    setOriginalSize(file.size)
    setCompressedPreview('')
    setCompressedBlob(null)
    setCompressedSize(0)
  }, [])

  const handleCompress = useCallback(async () => {
    if (!originalFile) return
    setIsProcessing(true)

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      }

      const compressed = await imageCompression(originalFile, options)
      const url = URL.createObjectURL(compressed)
      setCompressedPreview(url)
      setCompressedBlob(compressed)
      setCompressedSize(compressed.size)
    } catch (error) {
      console.error('压缩失败:', error)
      alert('图片压缩失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }, [originalFile, quality])

  const handleDownload = useCallback(() => {
    if (!compressedBlob || !originalFile) return
    const ext = originalFile.name.split('.').pop() || 'jpg'
    const name = originalFile.name.replace(/\.[^/.]+$/, '') + '_compressed.' + ext
    const url = URL.createObjectURL(compressedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }, [compressedBlob, originalFile])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const reduction = originalSize && compressedSize
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">在线图片压缩</h1>
          <p className="text-gray-600">支持JPG、PNG、WebP格式，可调节压缩质量</p>
        </div>

        {!originalFile ? (
          <ImageUploader
            onImageSelect={handleImageSelect}
            accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
          />
        ) : (
          <div className="space-y-6">
            {/* 质量控制 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <label className="font-medium text-gray-700 whitespace-nowrap">
                  压缩质量：{Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-500">
                  {quality < 0.4 ? '高压缩' : quality < 0.7 ? '中等' : '低压缩'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? '处理中...' : '开始压缩'}
                </button>
                <button
                  onClick={() => {
                    setOriginalFile(null)
                    setOriginalPreview('')
                    setCompressedPreview('')
                    setCompressedBlob(null)
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  重新选择
                </button>
                {compressedBlob && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    下载压缩图片
                  </button>
                )}
              </div>
            </div>

            {/* 压缩结果信息 */}
            {reduction && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-800 font-medium">
                  🎉 压缩完成！体积减小了 <span className="text-xl font-bold">{reduction}%</span>
                </p>
                <p className="text-green-600 text-sm mt-1">
                  {formatSize(originalSize)} → {formatSize(compressedSize)}
                </p>
              </div>
            )}

            {/* 预览对比 */}
            {originalPreview && (
              <ImagePreview
                originalSrc={originalPreview}
                processedSrc={compressedPreview || undefined}
                originalLabel="原图"
                processedLabel={compressedPreview ? '压缩后' : ''}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
