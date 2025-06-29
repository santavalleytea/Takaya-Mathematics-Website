// pages/posts/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

type FrontMatter = {
    title: string
    date: string
}

type Props = {
  source: MDXRemoteSerializeResult
  frontMatter: FrontMatter 
}

export default function PostPage({ source }: Props) {
  return (
    <div className="prose mx-auto p-4">
      <MDXRemote {...source} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('pages','posts')).filter(f => f.endsWith('.mdx'))
  const paths = files.map((filename) => ({
    params: { slug: filename.replace('.mdx', '') },
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const markdownWithMeta = fs.readFileSync(path.join('pages','posts', slug + '.mdx'), 'utf-8')
  const { content, data } = matter(markdownWithMeta)
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      format: 'mdx',
    },
  })
  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}
