'use client'

import { useState, useCallback, useRef } from 'react'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  accept?: Record<string, string[]>
}

export default function ImageUploader({ onImageSelect, accept }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      onImageSelect(file)
    },
    [onImageSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const acceptStr = accept
    ? Object.keys(accept).join(',')
    : 'image/*'

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`drop-zone border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptStr}
        onChange={handleChange}
        className="hidden"
      />

      <div className="text-6xl mb-4">📁</div>
      <p className="text-xl font-medium text-gray-700 mb-2">
        拖拽图片到此处，或点击上传
      </p>
      <p className="text-sm text-gray-500">
        支持 JPG、PNG、WebP 格式
      </p>
    </div>
  )
}
