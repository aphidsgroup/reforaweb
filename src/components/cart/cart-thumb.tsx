import Image from "next/image";
import { ProductVisual } from "@/components/ui/brand-art";
import { getProductBySlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Cart line-item thumbnail. Falls back to the product's composed study when
 * no photograph is stored on the line item, so the bag never shows a broken
 * image icon.
 */
export function CartThumb({
  imageUrl,
  name,
  slug,
  className,
}: {
  imageUrl?: string | null;
  name: string;
  slug: string;
  className?: string;
}) {
  const wrapper = cn("w-20 h-20 rounded-sm overflow-hidden shrink-0 relative bg-cream", className);

  if (imageUrl) {
    return (
      <div className={wrapper}>
        <Image src={imageUrl} alt={name} fill sizes="80px" className="object-cover" />
      </div>
    );
  }

  const product = getProductBySlug(slug);

  return (
    <ProductVisual
      kind={product?.study ?? "carton"}
      tone="warm"
      alt={name}
      label={product?.name ?? name}
      className={wrapper}
    />
  );
}
