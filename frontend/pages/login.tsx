import type { GetStaticProps, NextPage } from "next";
import type { UserCredentials } from "types";
import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Formik, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
    Heading,
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    VStack,
    Text,
    Link,
    HStack,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { useAuthContext } from "context";
import Image from "next/image";

const Login: NextPage = () => {
    const { login } = useAuthContext();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmission = async (
        values: UserCredentials,
        helpers: FormikHelpers<UserCredentials>
    ) => {
        const { success, error } = await login(values);
        if (success) {
            helpers.setSubmitting(false);
            await router.push("/dashboard");
            return;
        }
        if (error) {
            return helpers.setFieldError(error.field, error.message);
        }
    };

    const loginValidationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),
        rememberMe: Yup.boolean(),
    });

    return (
        <Flex
            bg="gray.100"
            align="center"
            justify="center"
            h="100vh"
            direction="row"
        >
            <Flex w="50%" direction="column" px="32">
                <Flex
                    direction="row"
                    w="full"
                    justify="space-between"
                    alignItems="center"
                    mb="20"
                >
                    <NextLink href="/">
                        <a>
                            <Image src="/logo.png" alt="logo" width={25} height={25} />
                        </a>
                    </NextLink>
                    <NextLink href="/register">
                        <a>
                            <Button variant="outline" colorScheme="purple" size="xs">
                                Register
                            </Button>
                        </a>
                    </NextLink>
                </Flex>
                <Heading as="h1" size="xl" marginBottom={4}>
                    Login
                </Heading>
                <Formik
                    initialValues={{
                        username: "",
                        password: "",
                        rememberMe: false,
                    }}
                    onSubmit={handleSubmission}
                    validationSchema={loginValidationSchema}
                >
                    {({ handleSubmit, errors, touched, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="flex-start">
                                <FormControl isInvalid={!!errors.username && touched.username}>
                                    <FormLabel htmlFor="username">Username</FormLabel>
                                    <Field
                                        as={Input}
                                        id="username"
                                        name="username"
                                        type="text"
                                        variant="outline"
                                        placeholder="Username"
                                    />
                                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.password && touched.password}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <InputGroup size="md">
                                        <Field
                                            as={Input}
                                            id="password"
                                            name="password"
                                            variant="outline"
                                            pr="4.5rem"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Button
                                                h="1.75rem"
                                                size="sm"
                                                bg="gray.200"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                                </FormControl>
                                <Field
                                    as={Checkbox}
                                    id="rememberMe"
                                    name="rememberMe"
                                    colorScheme="purple"
                                >
                                    Remember me?
                                </Field>
                                <Button
                                    type="submit"
                                    colorScheme="purple"
                                    width="full"
                                    isLoading={isSubmitting}
                                >
                                    Login
                                </Button>
                            </VStack>
                        </form>
                    )}
                </Formik>
                <HStack mt="4">
                    <Text fontSize="sm">
                        Don't have an account?{" "}
                        <NextLink href="/register" passHref>
                            <Link color="purple.500" fontWeight="medium">
                                Register
                            </Link>
                        </NextLink>
                    </Text>
                </HStack>
            </Flex>
            <Flex
                w="50%"
                h="full"
                bgGradient="linear(to-tr, #805AD5, #AE93F9)"
                justify="center"
                align="center"
                direction="column"
                gap="2"
            >
                <Image src="/logo-alt.svg" alt="logo" width={60} height={60} />
                <Text fontSize="3xl" fontWeight="bold" color="#AF93F9">
                    The Nighthawk Blog
                </Text>
            </Flex>
        </Flex>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            noNav: true,
        },
    };
};

export default Login;