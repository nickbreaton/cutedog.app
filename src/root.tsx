// @refresh reload
import { Suspense } from "solid-js";
import { A, Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title, Link } from "solid-start";
import { css } from "~styled-system/css";
import { Content } from "~/lib/components/Content";

import "./root.css";
import { Header } from "./lib/components/Header";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>CuteDog.app</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <Meta name="color-scheme" content="light dark" /> */}
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <Link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Nunito:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Body class={css({ fontFamily: "sans", bg: "gray.50", color: "text" })}>
        <Suspense>
          <ErrorBoundary>
            <Header />
            <div class={css({ paddingBlockStart: "3", paddingBlockEnd: "6" })}>
              <Routes>
                <FileRoutes />
              </Routes>
            </div>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
