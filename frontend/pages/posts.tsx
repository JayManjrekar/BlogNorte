import type { NextPage } from "next";
import type { PostPreview } from "types";
import axios from "axios";
import { useQuery } from "react-query";
import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { PostSection } from "components/posts";

type Props = {};

const Posts: NextPage<Props> = ({}: Props) => {
    const {
        data: res,
        isLoading,
        isSuccess,
        error,
    } = useQuery("posts", () =>
        axios.get<PostPreview[], { data: PostPreview[] }>(
            `${process.env.NEXT_PUBLIC_API_URL}/posts`
        )
    );

    return (
        <Flex align="start" direction="column" justify="center">
            <VStack marginBottom="6" align="start" justify="center">
                <Heading as="h1" size="xl" marginBottom={0} marginTop={4}>
                    Posts
                </Heading>
                <Text>
                    A collection of the finest Nighthawk Coding Society knowledge.
                </Text>
            </VStack>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : isSuccess ? (
                <PostSection posts={res.data} refetch={() => {}} />
            ) : (
                <Text>An error has occurred fetching posts.</Text>
            )}
        </Flex>
    );
};

export default Posts;