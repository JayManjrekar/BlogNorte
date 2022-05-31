import type { FC, ReactNode } from "react";
import type { PostPreview } from "types";
import Link from "next/link";
import axios from "axios";
import {
    Button,
    Flex,
    GridItem,
    Heading,
    HStack,
    Tag,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { BsTrashFill } from "react-icons/bs";
import { useAuthContext } from "context";

type Props = {
    post: PostPreview;
    isDashboard?: boolean;
    refetch: () => void;
};

export const PostCard: FC<Props> = ({ post, isDashboard, refetch }) => {
    return (
        <DashboardViewWrapper
            isDashboard={isDashboard}
            id={post.id}
            refetch={refetch}
        >
            <Link href={`post/${post.slug}`}>
                <a>
                    <GridItem
                        w="100%"
                        h="full"
                        p={5}
                        bg="#E2E8F050"
                        rounded="lg"
                        border="2px solid #E2E8F0"
                        _hover={{
                            borderColor: "purple.500",
                        }}
                    >
                        <Text size="lg">{post.date_posted}</Text>
                        <VStack gap={1} align="start">
                            <Heading as="h3" size="md">
                                {post.title}
                            </Heading>
                            <HStack spacing={4}>
                                {post.tags.map(({ id, name }) => (
                                    <Tag key={id} size="md" variant="subtle" colorScheme="purple">
                                        #{name}
                                    </Tag>
                                ))}
                            </HStack>
                            <Text size="md">{post.excerpt}</Text>
                        </VStack>
                    </GridItem>
                </a>
            </Link>
        </DashboardViewWrapper>
    );
};

const DashboardViewWrapper = ({
                                  id,
                                  isDashboard,
                                  refetch,
                                  children,
                              }: {
    id: number;
    isDashboard: boolean | undefined;
    refetch: () => void;
    children: ReactNode;
}) => {
    if (!isDashboard) return <>{children}</>;

    const toast = useToast();
    const { token } = useAuthContext();

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/posts/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            refetch();
            toast({
                title: "Post deleted",
                description: "The post has been deleted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex direction="column" gap={2}>
            {children}
            <HStack spacing={2}>
                <Link href={`/dashboard/edit/${id}`}>
                    <a>
                        <Button
                            leftIcon={<MdEdit />}
                            bg="#E2E8F050"
                            rounded="lg"
                            border="2px solid #E2E8F0"
                            size="sm"
                        >
                            Edit
                        </Button>
                    </a>
                </Link>
                <Button
                    onClick={handleDelete}
                    leftIcon={<BsTrashFill />}
                    bg="#ff7c7c10"
                    rounded="lg"
                    border="2px solid #ff7c7c10"
                    size="sm"
                    color="#ff5d5d"
                    _hover={{
                        bg: "#ff7c7c20",
                    }}
                >
                    Delete
                </Button>
            </HStack>
        </Flex>
    );
};