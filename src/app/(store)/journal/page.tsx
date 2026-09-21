import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Thoughts, rituals, and stories from REFORA — on skincare, ingredients, and everyday life.",
  openGraph: {
    title: "Journal | REFORA",
    description:
      "Thoughts, rituals, and stories from REFORA.",
    type: "website",
  },
};

interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  publishedAt: string;
  tags?: string[];
}

async function fetchPosts(): Promise<JournalPost[]> {
  // In production: query DB for published posts
  // const posts = await db.select().from(schema.journalPosts)
  //   .where(eq(schema.journalPosts.isPublished, true))
  //   .orderBy(desc(schema.journalPosts.publishedAt));
  return []; // Empty at launch — honest empty state
}

export default async function JournalIndexPage() {
  const posts = await fetchPosts();

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-cream py-16 text-center border-b border-sand">
        <div className="container-refora">
          <p className="text-xs tracking-[0.14em] text-gold uppercase mb-3">
            Stories
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light text-espresso">
            Journal
          </h1>
          <p className="mt-4 text-sm text-espresso/60 max-w-md mx-auto">
            Thoughts on ingredients, rituals, and the considered everyday.
          </p>
        </div>
      </div>

      <div className="container-refora py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className="group block"
                aria-label={`Read: ${post.title}`}
              >
                {/* Cover image */}
                {post.coverImageUrl && (
                  <div className="relative aspect-[16/9] bg-cream rounded-sm overflow-hidden mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImageUrl}
                      alt={post.coverImageAlt ?? post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(post.tags as string[]).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-widest text-gold uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="font-serif text-xl text-espresso mb-2 group-hover:text-gold transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-espresso/60 leading-relaxed line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
                <p className="text-xs text-espresso/40">
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          /* Honest empty state */
          <div className="text-center py-20">
            <p className="font-serif text-4xl text-espresso/30 mb-4">
              Articles coming soon.
            </p>
            <p className="text-sm text-espresso/50 max-w-sm mx-auto">
              We&apos;re writing about ingredients, rituals, and why simplicity
              matters. Check back soon.
            </p>
            <div className="mt-10">
              <Link href="/shop" className="btn btn-primary">
                Explore Our Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
