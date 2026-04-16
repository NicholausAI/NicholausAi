import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAdminPosts, createPost } from "@/lib/strapi-admin";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getAdminPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const post = await createPost({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      blockContent: data.blockContent,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      publishedAt: data.publishedAt,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
