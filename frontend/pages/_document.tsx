import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="icon" href="/logo.png" />
            </Head>
            <body style={{ backgroundColor: "#EDF2F7" }}>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}