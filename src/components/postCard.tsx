import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Post } from "@/types"
import Link from "next/link"





export default function PostCard({post}: {post: Post}) {
    return(

        <Card>
  <CardHeader>
      <img src={post.thumbnail || '/general-img-landscape.png'} alt="" className="w-full h-full "/>
  </CardHeader>
    <CardTitle><Link href={`edit/${post.slug}`}>{post.title}</Link></CardTitle>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
</Card>
    )
}