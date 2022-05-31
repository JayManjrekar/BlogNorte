import { Flex } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { Navigation, Footer } from ".";

type Props = {
    renderLayout: boolean;
    children: ReactNode;
};

export const Layout: FC<Props> = ({ renderLayout, children }) => {
    if (!renderLayout) {
        return <>{children}</>;
    }

    return (
        <Flex direction="column" gap="12" mx="44" my="20">
            <Navigation />
            {children}
            <Footer />
        </Flex>
    );
};