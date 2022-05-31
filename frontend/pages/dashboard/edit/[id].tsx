import type { GetServerSideProps, NextPage } from "next";
import type { ExistingPost, EditPost, Tag as TagType } from "types";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { Formik, Field, FormikHelpers, Form } from "formik";
import {
    FormControl,
    Input,
    FormLabel,
    Text,
    VStack,
    Textarea,
    Link,
    Button,
    Flex,
    Heading,
    FormErrorMessage,
    useToast,
    HStack,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useAuthContext } from "context";
import { TagSelector } from "components/control";

type Props = {
    post: ExistingPost;
};

export const getServerSideProps: GetServerSideProps = async ({
                                                                 req,
                                                                 query,
                                                             }) => {
    const { id } = query;
    const { token } = req.cookies;
    try {
        const response = await axios.get<ExistingPost>(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/getForUpdate/${id}`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
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

const Edit: NextPage<Props> = ({ post }) => {
    const { user, token } = useAuthContext();
    const router = useRouter();

    const toast = useToast();

    const {
        data: res,
        isLoading: tagsLoading,
        isSuccess: tagsSuccess,
    } = useQuery(
        "tags",
        () =>
            axios.get<TagType[], { data: TagType[] }>(
                `${process.env.NEXT_PUBLIC_API_URL}/tags`
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
        }
    );
    if (!user) {
        return <div>die</div>;
    }

    const handleSubmission = async (
        values: EditPost,
        helpers: FormikHelpers<EditPost>
    ) => {
        try {
            const response = await axios.put<EditPost>(
                `${process.env.NEXT_PUBLIC_API_URL}/posts/update/${post.id}`,
                { ...values, tags: values.tags.map((t) => t.id) },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            helpers.setSubmitting(false);
            console.log(response);
            toast({
                title: "Success",
                description: "Post updated",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            await router.push("/dashboard");
            return;
        } catch (error: any) {
            console.log(error);
            if (error.response.data?.field) {
                return helpers.setFieldError(
                    error.response.data.field,
                    error.response.data.message
                );
            } else {
                console.log(error);
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return { success: false, error: null };
            }
        }
    };

    const editPostValidationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        tags: Yup.array()
            .required("Tags is required")
            .min(1, "At least one tag is required")
            .max(4, "Max 4 tags"),
        excerpt: Yup.string().required("Excerpt is required"),
        content: Yup.string().required("Post content is required").min(200),
    });

    const postPlaceholder = `## Section 1 - The basics
Understanding python can be a bit tricky...`;

    return (
        <Flex align="start" direction="column" justify="center" w="full">
            <Heading as="h1" size="xl" marginBottom={4} marginTop={4}>
                New Post
            </Heading>
            <Formik
                initialValues={{
                    title: post.title,
                    excerpt: post.excerpt,
                    tags: post.tags,
                    content: post.content,
                }}
                onSubmit={handleSubmission}
                validationSchema={editPostValidationSchema}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form style={{ width: "100%" }}>
                        <VStack align="start" spacing={6} mb="12">
                            <FormControl w="50%" isInvalid={!!errors.title && touched.title}>
                                <FormLabel htmlFor="title">Title</FormLabel>
                                <Field
                                    as={Input}
                                    id="title"
                                    name="title"
                                    type="text"
                                    variant="outline"
                                    borderColor="gray.500"
                                    placeholder="Intro into python"
                                />
                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                            </FormControl>
                            <FormControl w="50%" isInvalid={!!errors.tags}>
                                <FormLabel htmlFor="tags">Tags</FormLabel>
                                <Text fontSize="sm" mt="-1" mb="3">
                                    Select all related categories for this post (min 1, max 4).
                                </Text>
                                <Flex display="inline">
                                    {tagsLoading ? (
                                        <Text>Loading tags...</Text>
                                    ) : tagsSuccess ? (
                                        <Field
                                            name="tags"
                                            component={TagSelector}
                                            tags={res.data}
                                        />
                                    ) : (
                                        <Text color="red">Error fetching tags...</Text>
                                    )}
                                </Flex>
                                <FormErrorMessage>{errors.tags as string}</FormErrorMessage>
                            </FormControl>
                            <FormControl
                                w="75%"
                                isInvalid={!!errors.excerpt && touched.excerpt}
                            >
                                <FormLabel htmlFor="excerpt">Excerpt</FormLabel>
                                <Text fontSize="sm" mt="-1" mb="3">
                                    A short description about your post.
                                </Text>
                                <Field
                                    as={Input}
                                    id="excerpt"
                                    name="excerpt"
                                    type="text"
                                    variant="outline"
                                    borderColor="gray.500"
                                    placeholder="Learn the basics of python"
                                />
                                <FormErrorMessage>{errors.excerpt}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.content && touched.content}>
                                <FormLabel htmlFor="content">Content</FormLabel>
                                <Text fontSize="sm" mt="-1" mb="3">
                                    All posts should be written in{" "}
                                    <Link
                                        color="purple.500"
                                        textDecoration="underline"
                                        href="https://www.markdownguide.org/cheat-sheet/"
                                    >
                                        markdown
                                    </Link>{" "}
                                    to be properly displayed. The title will also act as the h1.
                                </Text>
                                <Field
                                    h="xl"
                                    as={Textarea}
                                    id="content"
                                    name="content"
                                    type="text"
                                    borderColor="gray.500"
                                    variant="outline"
                                    placeholder="Your post written in markdown syntax"
                                />
                                <FormErrorMessage>{errors.content}</FormErrorMessage>
                            </FormControl>
                            <HStack spacing={2}>
                                <Button
                                    colorScheme="purple"
                                    size="md"
                                    px="8"
                                    type="submit"
                                    isLoading={isSubmitting}
                                >
                                    Update Post
                                </Button>
                                <NextLink href="/dashboard">
                                    <a>
                                        <Button
                                            colorScheme="blackAlpha"
                                            size="md"
                                            px="8"
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                    </a>
                                </NextLink>
                            </HStack>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default Edit;