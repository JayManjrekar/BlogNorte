import type { FC } from "react";
import { Fragment } from "react";
import type { PostPreview } from "types";
import { Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { PostCard } from ".";

type Props = {
    posts: PostPreview[];
    isDashboard?: boolean;
    refetch: () => void;
};

type OrderedPosts = {
    [key: string]: {
        [key: string]: PostPreview[];
    };
};

export const PostSection: FC<Props> = ({ posts, isDashboard, refetch }) => {
    const orderedPosts = posts.reduce((acc, post) => {
        const year = post.date_posted.split(", ")[1].trim();
        if (!acc[year]) {
            acc[year] = {};
        }
        const month = post.date_posted.split(", ")[0].replace(/[0-9]/g, "").trim();
        if (!acc[year][month]) {
            acc[year][month] = [];
        }
        acc[year][month].push(post);
        return acc;
    }, {} as OrderedPosts);

    return (
        <Flex direction="column" w="full">
            {Object.keys(orderedPosts).map((year) =>
                Object.keys(orderedPosts[year]).map((month) => {
                    return (
                        <Fragment key={month}>
                            <Heading as="h2" size="md" marginBottom={4} marginTop={4}>
                                {month} - {year}
                            </Heading>
                            <SimpleGrid minChildWidth="400px" spacing="20px" width="full">
                                {orderedPosts[year][month]
                                    .sort((p1, p2) =>
                                        p2.date_posted.localeCompare(p1.date_posted)
                                    )
                                    .map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            refetch={refetch}
                                            isDashboard={isDashboard}
                                        />
                                    ))}
                            </SimpleGrid>
                        </Fragment>
                    );
                })
            )}
        </Flex>
    );
};