import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
    Avatar,
    Button,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useAuthContext } from "context";

type Props = {};

export const Navigation: FC<Props> = () => {
    const { user, loggedIn, logout } = useAuthContext();

    const router = useRouter();

    const links = [
        { href: "/", label: "Home", isActive: router.pathname === "/" },
        {
            href: "/posts",
            label: "Posts",
            isActive: router.pathname.includes("/posts"),
        },
        {
            href: "/dashboard",
            label: "Dashboard",
            isActive: router.pathname.includes("/dashboard"),
        },
    ];

    return (
        <Flex direction="row" w="full" justify="space-between">
            <HStack spacing={12} pos="relative">
                <Link href="/">
                    <a style={{ position: "relative", top: "2px" }}>
                        <Image src="/logo.png" alt="logo" width={30} height={30} />
                    </a>
                </Link>
                <HStack spacing={8}>
                    {links.map(({ href, label, isActive }) => (
                        <Link href={href}>
                            <a>
                                <Text
                                    color={isActive ? "black" : "gray.500"}
                                    fontWeight={isActive ? "bold" : "normal"}
                                >
                                    {label}
                                </Text>
                            </a>
                        </Link>
                    ))}
                </HStack>
            </HStack>
            <HStack spacing={4}>
                <NewPostButton />
                {loggedIn ? (
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            border="none"
                            icon={
                                <Avatar
                                    size="sm"
                                    name={
                                        loggedIn
                                            ? `${user?.firstname} ${user?.lastname}`
                                            : undefined
                                    }
                                    bg="purple.200"
                                />
                            }
                            variant="outline"
                        />
                        <MenuList>
                            <Link href="/dashboard">
                                <a>
                                    <MenuItem>Dashboard</MenuItem>
                                </a>
                            </Link>
                            <MenuDivider />
                            <MenuItem
                                color="red.500"
                                _hover={{ bg: "red.50" }}
                                icon={<FiLogOut />}
                                onClick={logout}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    <LoginButton />
                )}
            </HStack>
        </Flex>
    );
};

const LoginButton: FC = () => (
    <Link href="/login">
        <a>
            <Button colorScheme="purple" variant="outline" size="sm">
                Login
            </Button>
        </a>
    </Link>
);

const NewPostButton: FC = () => (
    <Link href="/dashboard/new">
        <a>
            <Button leftIcon={<HiPencil />} colorScheme="purple" size="sm">
                New Post
            </Button>
        </a>
    </Link>
);