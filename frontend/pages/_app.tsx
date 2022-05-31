import type { AppProps as NextAppProps } from "next/app";
import type { User } from "types";
import App from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";
import { AuthProvider } from "context";
import { fetchUser } from "lib";
import { Layout } from "components/layout";

interface AppProps extends NextAppProps {
    sessionUser: User | null;
    sessionToken: string | null;
}

const theme = extendTheme(
    {
        brand: {
            900: "#1a365d",
            800: "#153e75",
            700: "#2a69ac",
        },
    },
    withProse({
        baseStyle: {
            pre: {
                fontFamily: "monospace",
                fontSize: "1rem",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                overflow: "auto",
                padding: "0.6rem 1rem",
                margin: "0.2rem 0.4rem",
                borderRadius: "0.5rem",
                border: "1px solid #2b2b2b15",
                backgroundColor: "#2b2b2b05",
                transition: "all 0.2s ease-in-out",
                color: "#2b2b2b",
            },
        },
    })
);

const queryClient = new QueryClient();

function NighthawkBlog({
                           Component,
                           pageProps,
                           sessionUser,
                           sessionToken,
                       }: AppProps) {
    const { noNav } = pageProps;

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <AuthProvider sessionUser={sessionUser} sessionToken={sessionToken}>
                    <Layout renderLayout={noNav === undefined ? true : !noNav}>
                        <Component {...pageProps} />
                    </Layout>
                </AuthProvider>
            </ChakraProvider>
        </QueryClientProvider>
    );
}

NighthawkBlog.getInitialProps = async (app: any) => {
    const appProps = await App.getInitialProps(app);
    const cookies = app.ctx.req?.cookies;
    const user = cookies ? await fetchUser({ cookies }) : null;
    return { ...appProps, sessionUser: user, sessionToken: cookies?.token };
};

export default NighthawkBlog;