import type { NextPage } from "next";
import type { FC } from "react";
import type { PostPreview } from "types";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "react-query";
import {
    Heading,
    VStack,
    Text,
    Button,
    Flex,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";
import { useAuthContext } from "context";
import { PostSection } from "components/posts";

type Props = {};

const Dashboard: NextPage<Props> = ({}) => {
    const { user } = useAuthContext();
    const [posts, setPosts] = useState<PostPreview[]>([]);

    const toast = useToast();

    const hasPosts = posts.length > 0;

    const {
        isLoading,
        isError: errorFetchingPosts,
        refetch,
    } = useQuery(
        "posts",
        () =>
            axios.get<PostPreview[], { data: PostPreview[] }>(
                `/api/users/${user!.id}/posts`
            ),
        {
            onError: (err: any) => {
                console.log(err);
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            },
            onSuccess: (data) => {
                setPosts(data.data);
            },
        }
    );

    if (!user) {
        return (
            <div>How tf you get here I literally implemented middleware and ssr</div>
        );
    }

    return (
        <Flex align="start" direction="column" justify="center">
            <Heading as="h1" size="xl" marginBottom={4} marginTop={4}>
                Welcome Back, {user.firstname}
            </Heading>
            {errorFetchingPosts ? (
                <PostsError />
            ) : isLoading ? (
                <Spinner />
            ) : hasPosts ? (
                <PostSection posts={posts} isDashboard refetch={refetch} />
            ) : (
                <NoPosts />
            )}
        </Flex>
    );
};

const NewPostButton: FC = () => {
    return (
        <Link href="/dashboard/new">
            <a>
                <Button leftIcon={<HiPencil />} colorScheme="purple" size="sm">
                    New Post
                </Button>
            </a>
        </Link>
    );
};

export const NoPosts: FC = () => {
    return (
        <VStack align="start" gap="2">
            <Heading as="h2" size="md">
                You have no posts
            </Heading>
            <Text fontSize="">
                You have not created any posts yet. Click the button below to create a
                new post.
            </Text>
            <NewPostButton />
        </VStack>
    );
};

export const PostsError: FC = () => {
    return (
        <Text fontSize="lg" fontWeight="bold" color="red.400">
            Error fetching posts, please try again later.
        </Text>
    );
};
export default Dashboard;