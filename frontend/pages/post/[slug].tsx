import type { GetServerSideProps, NextPage } from "next";
import type { FC } from "react";
import type { FullPost, User } from "types";
import axios from "axios";
import {
    Avatar,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    Stack,
    Tag,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { FaGithub, FaHeart, FaLongArrowAltLeft } from "react-icons/fa";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import Link from "next/link";

type Props = {
    post: FullPost;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { slug } = query;
    try {
        const response = await axios.get<FullPost>(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`
        );
        return {
            props: {
                post: response.data,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            redirect: {
                permanent: false,
                destination: "/404",
            },
        };
    }
};

const Slug: NextPage<Props> = ({ post }) => {
    return (
        <Flex direction="column">
            <UserBanner {...post.author} likes={post.likes} />
            <VStack spacing={4} align="start">
                <Heading size="2xl">{post.title}</Heading>
                <HStack spacing={4}>
                    {post.tags.map(({ id, name }) => (
                        <Tag key={id} size="md" variant="subtle" colorScheme="purple">
                            #{name}
                        </Tag>
                    ))}
                </HStack>
                <Text fontSize="lg" mt="2">
                    {post.excerpt}
                </Text>
            </VStack>

            <Divider mb="-8" mt="6" />

            <Prose>
                <ReactMarkdown
                    children={post.content}
                    remarkPlugins={[remarkGfm, remarkMath]}
                />
            </Prose>
            <Link href="/posts">
                <Button
                    as="a"
                    cursor="pointer"
                    leftIcon={<FaLongArrowAltLeft />}
                    w="40"
                >
                    Back to posts
                </Button>
            </Link>
        </Flex>
    );
};

const UserBanner: FC<User & { likes: number }> = ({
                                                      id,
                                                      firstname,
                                                      lastname,
                                                      username,
                                                      github,
                                                      likes,
                                                  }) => {
    const canLike = true;
    const hasLiked = true;
    const cantLike = false;

    return (
        <Flex justify="space-between" w="full" marginBottom="6" align="center">
            <Stack direction="row" gap="2" align="center">
                <Avatar size="sm" name={`${firstname} ${lastname}`} bg="highlight" />
                <Flex direction="column">
                    <Text fontWeight="bold" fontSize="regular">
                        {firstname} {lastname}
                    </Text>
                    <Stack direction="row" align="center">
                        <Text fontSize="xs">@{username}</Text>
                        {github && (
                            <Button
                                as="a"
                                size="xs"
                                href={`
                https://github.com/${github}
              `}
                                leftIcon={<FaGithub />}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {github}
                            </Button>
                        )}
                    </Stack>
                </Flex>
            </Stack>
            <Tooltip hasArrow label="Coming soon..." bg="gray.200" color="gray.400">
                <Button
                    bg={hasLiked ? "gray.200" : "red.500"}
                    color={hasLiked ? "gray.400" : "white"}
                    _hover={{ bg: hasLiked ? "gray.200" : "red.400" }}
                    // disabled={hasLiked}
                    cursor={hasLiked ? "not-allowed" : "pointer"}
                    size="sm"
                    leftIcon={<FaHeart />}
                >
                    {likes}
                </Button>
            </Tooltip>
        </Flex>
    );
};

export default Slug;