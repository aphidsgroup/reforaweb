import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  uniqueIndex,
  index,
  decimal,
  pgEnum,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
  "upcoming",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "razorpay_upi",
  "razorpay_card",
  "razorpay_netbanking",
  "razorpay_wallet",
  "cod",
]);

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "pending",
  "pickup_requested",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "rto_initiated",
  "rto_delivered",
  "cancelled",
  "lost",
]);

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
  "free_shipping",
  "buy_x_get_y",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);

export const adminRoleEnum = pgEnum("admin_role", ["super_admin", "admin", "staff"]);

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id),
    imageUrl: text("image_url"),
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)]
);

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id").references(() => categories.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description"),
    description: text("description"),
    ingredients: text("ingredients"),
    howToUse: text("how_to_use"),
    cautions: text("cautions"),
    specifications: jsonb("specifications"), // for organic products: origin, process, etc.
    // Prices in paise (smallest Indian unit)
    priceInPaise: integer("price_in_paise").notNull(),
    mrpInPaise: integer("mrp_in_paise"),
    taxPercent: decimal("tax_percent", { precision: 5, scale: 2 }).default("0"),
    sku: text("sku"),
    weight: integer("weight"), // grams
    dimensions: jsonb("dimensions"), // {l, w, h} in cm
    status: productStatusEnum("status").default("draft").notNull(),
    isFeatured: boolean("is_featured").default(false),
    isDigital: boolean("is_digital").default(false),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_status_idx").on(t.status),
  ]
);

// ─── PRODUCT IMAGES ───────────────────────────────────────────────────────────

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  cloudinaryId: text("cloudinary_id").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── PRODUCT VARIANTS ─────────────────────────────────────────────────────────

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(), // e.g. "100g", "200g"
  sku: text("sku"),
  priceInPaise: integer("price_in_paise").notNull(),
  mrpInPaise: integer("mrp_in_paise"),
  weight: integer("weight"),
  isDefault: boolean("is_default").default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── INVENTORY ────────────────────────────────────────────────────────────────

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(0).notNull(),
  reserved: integer("reserved").default(0).notNull(), // held for pending orders
  lowStockThreshold: integer("low_stock_threshold").default(5),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    phone: text("phone"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    passwordHash: text("password_hash"),
    emailVerified: boolean("email_verified").default(false),
    marketingConsent: boolean("marketing_consent").default(false),
    whatsappConsent: boolean("whatsapp_consent").default(false),
    totalOrders: integer("total_orders").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("customers_email_idx").on(t.email)]
);

// ─── CUSTOMER ADDRESSES ───────────────────────────────────────────────────────

export const customerAddresses = pgTable("customer_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  country: text("country").default("IN").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── CARTS ────────────────────────────────────────────────────────────────────

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  sessionId: text("session_id"), // for guest carts
  couponCode: text("coupon_code"),
  discountInPaise: integer("discount_in_paise").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id").references(() => carts.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").default(1).notNull(),
  priceInPaise: integer("price_in_paise").notNull(), // snapshot at time of add
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: text("order_number").notNull(), // human-readable REF-XXXXXX
    accessToken: text("access_token").notNull(), // secure random token for tracking
    customerId: uuid("customer_id").references(() => customers.id),
    // Guest info (if not logged in)
    guestEmail: text("guest_email"),
    guestPhone: text("guest_phone"),
    // Shipping address snapshot
    shippingName: text("shipping_name").notNull(),
    shippingPhone: text("shipping_phone").notNull(),
    shippingLine1: text("shipping_line1").notNull(),
    shippingLine2: text("shipping_line2"),
    shippingCity: text("shipping_city").notNull(),
    shippingState: text("shipping_state").notNull(),
    shippingPincode: text("shipping_pincode").notNull(),
    shippingCountry: text("shipping_country").default("IN"),
    // Amounts (all in paise)
    subtotalInPaise: integer("subtotal_in_paise").notNull(),
    discountInPaise: integer("discount_in_paise").default(0),
    shippingInPaise: integer("shipping_in_paise").default(0),
    taxInPaise: integer("tax_in_paise").default(0),
    totalInPaise: integer("total_in_paise").notNull(),
    couponCode: text("coupon_code"),
    // Status
    status: orderStatusEnum("status").default("pending").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    notes: text("notes"),
    cancelReason: text("cancel_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    confirmedAt: timestamp("confirmed_at"),
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
    cancelledAt: timestamp("cancelled_at"),
  },
  (t) => [
    uniqueIndex("orders_number_idx").on(t.orderNumber),
    uniqueIndex("orders_token_idx").on(t.accessToken),
    index("orders_customer_idx").on(t.customerId),
    index("orders_status_idx").on(t.status),
  ]
);

// ─── ORDER LINES ──────────────────────────────────────────────────────────────

export const orderLines = pgTable("order_lines", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  // Snapshots at order time
  productName: text("product_name").notNull(),
  variantName: text("variant_name"),
  sku: text("sku"),
  quantity: integer("quantity").notNull(),
  unitPriceInPaise: integer("unit_price_in_paise").notNull(),
  totalInPaise: integer("total_in_paise").notNull(),
  imageUrl: text("image_url"),
});

// ─── PAYMENT ATTEMPTS ─────────────────────────────────────────────────────────

export const paymentAttempts = pgTable(
  "payment_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id).notNull(),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    amountInPaise: integer("amount_in_paise").notNull(),
    currency: text("currency").default("INR"),
    status: paymentStatusEnum("status").default("pending").notNull(),
    method: paymentMethodEnum("method"),
    gatewayResponse: jsonb("gateway_response"),
    webhookEventId: text("webhook_event_id"), // idempotency key
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("payment_order_idx").on(t.orderId),
    index("payment_rzp_order_idx").on(t.razorpayOrderId),
  ]
);

// ─── SHIPMENTS ────────────────────────────────────────────────────────────────

export const shipments = pgTable("shipments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  provider: text("provider").default("shiprocket"),
  providerShipmentId: text("provider_shipment_id"),
  awbCode: text("awb_code"),
  courierId: text("courier_id"),
  courierName: text("courier_name"),
  trackingUrl: text("tracking_url"),
  status: shipmentStatusEnum("status").default("pending").notNull(),
  estimatedDelivery: timestamp("estimated_delivery"),
  labelUrl: text("label_url"),
  providerResponse: jsonb("provider_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── DISCOUNTS / COUPONS ─────────────────────────────────────────────────────

export const discounts = pgTable(
  "discounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code"), // null for automatic discounts
    name: text("name").notNull(),
    type: discountTypeEnum("type").notNull(),
    value: decimal("value", { precision: 10, scale: 2 }).notNull(), // % or paise
    minimumOrderInPaise: integer("minimum_order_in_paise").default(0),
    maximumDiscountInPaise: integer("maximum_discount_in_paise"), // cap for % discounts
    isAutomatic: boolean("is_automatic").default(false),
    isFirstOrderOnly: boolean("is_first_order_only").default(false),
    usageLimit: integer("usage_limit"), // null = unlimited
    usageCount: integer("usage_count").default(0),
    perCustomerLimit: integer("per_customer_limit").default(1),
    isActive: boolean("is_active").default(true),
    startsAt: timestamp("starts_at"),
    expiresAt: timestamp("expires_at"),
    applicableProductIds: jsonb("applicable_product_ids"), // [] = all products
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("discounts_code_idx").on(t.code)]
);

export const discountUsages = pgTable("discount_usages", {
  id: uuid("id").defaultRandom().primaryKey(),
  discountId: uuid("discount_id").references(() => discounts.id).notNull(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

// ─── SHIPPING RULES ───────────────────────────────────────────────────────────

export const shippingRules = pgTable("shipping_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  freeShippingThresholdInPaise: integer("free_shipping_threshold_in_paise"),
  flatRateInPaise: integer("flat_rate_in_paise").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  orderId: uuid("order_id").references(() => orders.id), // for verified purchase
  rating: integer("rating").notNull(), // 1–5
  title: text("title"),
  body: text("body"),
  mediaUrls: jsonb("media_urls"), // approved photo/video cloudinary URLs
  status: reviewStatusEnum("status").default("pending").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── WISHLISTS ────────────────────────────────────────────────────────────────

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("wishlists_customer_product_idx").on(t.customerId, t.productId)]
);

// ─── JOURNAL (BLOG) ───────────────────────────────────────────────────────────

export const journalPosts = pgTable(
  "journal_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content"), // rich text / MDX
    coverImageUrl: text("cover_image_url"),
    coverImageAlt: text("cover_image_alt"),
    isPublished: boolean("is_published").default(false),
    publishedAt: timestamp("published_at"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    tags: jsonb("tags"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("journal_slug_idx").on(t.slug)]
);

// ─── FAQS ─────────────────────────────────────────────────────────────────────

export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").default("general"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── LEGAL PAGES ─────────────────────────────────────────────────────────────

export const legalPages = pgTable(
  "legal_pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(), // privacy, terms, shipping, returns, cancellation, cookies
    title: text("title").notNull(),
    content: text("content").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("legal_pages_slug_idx").on(t.slug)]
);

// ─── CONTENT BLOCKS (homepage CMS) ───────────────────────────────────────────

export const contentBlocks = pgTable("content_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull(), // hero, announcement_bar, organic_preview, etc.
  data: jsonb("data").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── NEWSLETTER CONSENTS ─────────────────────────────────────────────────────

export const newsletterConsents = pgTable(
  "newsletter_consents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    source: text("source"), // homepage, product_page, popup
    isSubscribed: boolean("is_subscribed").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    unsubscribedAt: timestamp("unsubscribed_at"),
  },
  (t) => [uniqueIndex("newsletter_email_idx").on(t.email)]
);

// ─── ADMIN USERS ──────────────────────────────────────────────────────────────

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: adminRoleEnum("role").default("staff").notNull(),
    isActive: boolean("is_active").default(true),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("admin_email_idx").on(t.email)]
);

export const adminAuditLog = pgTable("admin_audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id").references(() => adminUsers.id).notNull(),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  variants: many(productVariants),
  inventory: many(inventory),
  reviews: many(reviews),
  wishlists: many(wishlists),
  orderLines: many(orderLines),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  children: many(categories),
  products: many(products),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  lines: many(orderLines),
  payments: many(paymentAttempts),
  shipments: many(shipments),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(customerAddresses),
  orders: many(orders),
  carts: many(carts),
  wishlists: many(wishlists),
  reviews: many(reviews),
}));
