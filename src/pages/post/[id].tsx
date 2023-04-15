import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/PageLayout";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/utils/ssgHelper";
import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("Post id is not a string");

  await ssg.posts.getPostById.prefetch({ id: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1, // revalidate every 1 second
  };
};

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getPostById.useQuery({
    id: id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

// This function generates all possible paths on the server
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
