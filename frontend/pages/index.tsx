import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button, ButtonGroup, Flex, Heading, Text } from "@chakra-ui/react";
import { MdTravelExplore } from "react-icons/md";
import { HiPencil } from "react-icons/hi";

const Home: NextPage = () => {
    return (
        <Flex align="center" direction="column" justify="center" h="70vh">
            <Head>
                <title>Nighthawk Blog</title>
            </Head>
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <Heading as="h1" size="xl" marginBottom={4} marginTop={4}>
                The Nighthawk Blog
            </Heading>
            <Text fontSize="lg">Blog content by the students for the students.</Text>
            <ButtonGroup mt={4} spacing={4}>
                <Link href="/dashboard">
                    <a>
                        <Button colorScheme="purple" size="sm" leftIcon={<HiPencil />}>
                            Start writing
                        </Button>
                    </a>
                </Link>
                <Link href="/posts">
                    <a>
                        <Button
                            colorScheme="purple"
                            variant="outline"
                            size="sm"
                            leftIcon={<MdTravelExplore />}
                        >
                            Explore posts
                        </Button>
                    </a>
                </Link>
            </ButtonGroup>
        </Flex>
    );
};

export default Home;
