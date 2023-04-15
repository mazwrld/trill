import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

// This is a type that combines the post and author data
type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];
// This component is responsible for rendering a single post
export const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;
  dayjs.extend(relativeTime);

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile image`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
        placeholder="blur"
        blurDataURL={author.profileImageUrl}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 font-medium text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-normal">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
