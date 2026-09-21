import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

interface JournalArticle {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  publishedAt: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

async function fetchArticle(slug: string): Promise<JournalArticle | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://refora.in";
    const res = await fetch(`${baseUrl}/api/journal/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const title = article.metaTitle ?? article.title;
  const description =
    article.metaDescription ?? article.excerpt ?? "A journal article from REFORA.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | REFORA Journal`,
      description,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.coverImageUrl
        ? [{ url: article.coverImageUrl, alt: article.coverImageAlt ?? title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | REFORA`,
      description,
    },
  };
}

// ─── Render article content (line-based, not full MDX) ───────────────────────
function ArticleContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-4 text-espresso/75 leading-relaxed max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className="font-serif text-3xl text-espresso mt-8 mb-2">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="font-serif text-2xl text-espresso mt-6 mb-2">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="font-medium text-lg text-espresso mt-4 mb-1">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.trim() === "") {
          return <div key={i} className="h-3" />;
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-base">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="text-espresso">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.publishedAt);

  // Structured data for article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.coverImageUrl,
    publisher: {
      "@type": "Organization",
      name: "REFORA",
      url: "https://refora.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="bg-ivory min-h-screen">
        {/* Cover image */}
        {article.coverImageUrl && (
          <div className="w-full aspect-[21/9] bg-cream overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl}
              alt={article.coverImageAlt ?? article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="container-refora max-w-2xl mx-auto py-12">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-espresso/40">
              <li>
                <Link href="/" className="hover:text-espresso transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link
                  href="/journal"
                  className="hover:text-espresso transition-colors"
                >
                  Journal
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li className="text-espresso/60 truncate max-w-[200px]">
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Tags */}
          {article.tags && (article.tags as string[]).length > 0 && (
            <div className="flex flex-wrap gap-3 mb-5">
              {(article.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] tracking-widest text-gold uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-espresso leading-tight mb-4">
            {article.title}
          </h1>

          {/* Date */}
          <time
            dateTime={article.publishedAt}
            className="block text-xs text-espresso/40 mb-8"
          >
            {publishedDate.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-espresso/60 leading-relaxed border-l-2 border-gold pl-4 mb-8 italic font-serif">
              {article.excerpt}
            </p>
          )}

          <span className="gold-rule mb-8" aria-hidden="true" />

          {/* Content */}
          <ArticleContent content={article.content} />

          {/* Back to journal */}
          <div className="mt-12 pt-8 border-t border-sand">
            <Link href="/journal" className="btn-ghost text-sm">
              ← Back to Journal
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
