/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as categories from "../categories.js";
import type * as customerVault from "../customerVault.js";
import type * as leadMagnets from "../leadMagnets.js";
import type * as media from "../media.js";
import type * as navigation from "../navigation.js";
import type * as newsletters from "../newsletters.js";
import type * as posts from "../posts.js";
import type * as products from "../products.js";
import type * as purchases from "../purchases.js";
import type * as resources from "../resources.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as subscribers from "../subscribers.js";
import type * as subscriptions from "../subscriptions.js";
import type * as tags from "../tags.js";
import type * as webhookEvents from "../webhookEvents.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  customerVault: typeof customerVault;
  leadMagnets: typeof leadMagnets;
  media: typeof media;
  navigation: typeof navigation;
  newsletters: typeof newsletters;
  posts: typeof posts;
  products: typeof products;
  purchases: typeof purchases;
  resources: typeof resources;
  seed: typeof seed;
  settings: typeof settings;
  subscribers: typeof subscribers;
  subscriptions: typeof subscriptions;
  tags: typeof tags;
  webhookEvents: typeof webhookEvents;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
