import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useState } from 'react'

import { InlineMath } from 'react-katex'
import ParticlesBackground from '@/components/ParticlesBackground'
import 'katex/dist/katex.min.css'

const categories = ['All', 'Algebra', 'Analysis', 'Topology', 'Number Theory', 'Philosophy']

type Post = {
  slug: string
  title: string
  date: string
  category: string
  summary: string
}

type Props = {
  posts: Post[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dirPath = path.join('pages', 'posts')
  const files = fs.readdirSync(dirPath)

  const posts: Post[] = files
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const filePath = path.join(dirPath, filename)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(fileContent)

      return {
        slug,
        title: data?.title ?? 'Untitled',
        date: data?.date ?? 'Unknown date',
        category: data?.category ?? 'Uncategorized',
        summary: data?.summary ?? '',
      }
    })

  return {
    props: {
      posts,
    },
  }
}

export default function Home({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter(
          (post) =>
            post.category.toLowerCase() === selectedCategory.toLowerCase()
        )

  return (
    <>
      <ParticlesBackground />

      <div className="prose prose-invert max-w-7xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-6">📘 My Math Blog</h1>

        <div className="flex gap-4 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded border text-sm transition ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(({ slug, title, date, category, summary }) => (
            <li key={slug}>
              <Link
                href={`/posts/${slug}`}
                className="block h-full p-4 rounded-xl border border-neutral-700 bg-black/60 shadow-lg backdrop-blur-sm hover:border-blue-400 hover:bg-black/70 transition-all hover:scale-[1.02] duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-300">
                    {category}
                  </span>
                  <span className="text-xs text-neutral-500">{date}</span>
                </div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  <InlineMath math={title} />
                </h2>
                <p className="text-sm text-neutral-400">{summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
