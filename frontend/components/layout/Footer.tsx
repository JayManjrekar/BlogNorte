import type { FC } from "react";
import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

type Props = {};

export const Footer: FC<Props> = ({}) => {
    return (
        <Flex justify="space-between" w="full" alignItems="center">
            <Text fontSize="sm">Copyright ©2022 BlogNorte</Text>
            <HStack spacing={4}>
                <a href="https://github.com/Tigran7/BlogNorte">
                    <Button leftIcon={<FaGithub />} size="sm">
                        Github
                    </Button>
                </a>
            </HStack>
        </Flex>
    );
};