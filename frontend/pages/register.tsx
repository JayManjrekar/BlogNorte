import type { GetStaticProps, NextPage } from "next";
import type { UserRegistrationCredentials } from "types";
import { useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Image from "next/image";
import { Formik, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
    Heading,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    VStack,
    Link,
    HStack,
    InputGroup,
    InputRightElement,
    Text,
} from "@chakra-ui/react";
import { useAuthContext } from "context";

const Register: NextPage = () => {
    const { register } = useAuthContext();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmission = async (
        values: UserRegistrationCredentials,
        helpers: FormikHelpers<UserRegistrationCredentials>
    ) => {
        const { success, error } = await register(values);
        if (success) {
            helpers.setSubmitting(false);
            await router.push("/login");
            return;
        }
        if (error) {
            return helpers.setFieldError(error.field, error.message);
        }
    };

    const registerValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required("Firstname is required")
            .matches(/^[aA-zZ\s]+$/, "Firstname cannot contain numbers"),
        lastname: Yup.string()
            .required("Lastname is required")
            .matches(/^[aA-zZ\s]+$/, "Lastname cannot contain numbers"),
        username: Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be less than 20 characters"),
        password: Yup.string()
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
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
                    <NextLink href="/login">
                        <a>
                            <Button variant="outline" colorScheme="purple" size="xs">
                                Login
                            </Button>
                        </a>
                    </NextLink>
                </Flex>
                <Heading as="h1" size="xl" marginBottom={4}>
                    Register
                </Heading>
                <Formik
                    initialValues={{
                        firstname: "",
                        lastname: "",
                        username: "",
                        password: "",
                    }}
                    onSubmit={handleSubmission}
                    validationSchema={registerValidationSchema}
                >
                    {({ handleSubmit, errors, touched, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="flex-start">
                                <HStack spacing={4} alignItems="start">
                                    <FormControl
                                        isInvalid={!!errors.firstname && touched.firstname}
                                    >
                                        <FormLabel htmlFor="firstname">Firstname</FormLabel>
                                        <Field
                                            as={Input}
                                            id="firstname"
                                            name="firstname"
                                            type="text"
                                            variant="outline"
                                            placeholder="Firstname"
                                        />
                                        <FormErrorMessage>{errors.firstname}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        isInvalid={!!errors.lastname && touched.lastname}
                                    >
                                        <FormLabel htmlFor="lastname">Lastname</FormLabel>
                                        <Field
                                            as={Input}
                                            id="lastname"
                                            name="lastname"
                                            type="text"
                                            variant="outline"
                                            placeholder="Lastname"
                                        />
                                        <FormErrorMessage>{errors.lastname}</FormErrorMessage>
                                    </FormControl>
                                </HStack>
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
                                <Button
                                    type="submit"
                                    colorScheme="purple"
                                    width="full"
                                    isLoading={isSubmitting}
                                >
                                    Register
                                </Button>
                            </VStack>
                        </form>
                    )}
                </Formik>
                <HStack mt="4">
                    <Text fontSize="sm">
                        Already have an account?{" "}
                        <NextLink href="/login" passHref>
                            <Link color="purple.500" fontWeight="medium">
                                Login
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

export default Register;