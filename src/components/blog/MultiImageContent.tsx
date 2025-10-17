'use client'

import Image from 'next/image'

interface MultiImageContentProps {
  content: string
  images: string[]
}

export default function MultiImageContent({ content, images }: MultiImageContentProps) {

  // Function to insert images into content at strategic points
  const renderContentWithImages = () => {
    if (!images || images.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />
    }

    // Split content into paragraphs
    const paragraphs = content.split('</p>')
    const result = []

    for (let i = 0; i < paragraphs.length; i++) {
      result.push(paragraphs[i])
      
      // Add image after every 2-3 paragraphs
      if (i > 0 && i % 2 === 0 && images[Math.floor(i / 2) - 1]) {
        const imageIndex = Math.floor(i / 2) - 1
        if (imageIndex < images.length) {
          result.push(`
            <div class="my-8 text-center">
              <img 
                src="${images[imageIndex]}" 
                alt="Article image ${imageIndex + 1}"
                class="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                style="max-height: 500px; object-fit: cover;"
              />
            </div>
          `)
        }
      }
    }

    return <div dangerouslySetInnerHTML={{ __html: result.join('</p>') }} />
  }

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
      {renderContentWithImages()}
      
      {/* Image Gallery at the end */}
      {images && images.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Article Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Article image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                    Image {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
