import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { Stylesheet, InjectionMode, resetIds } from "office-ui-fabric-react";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Fluent UI styles
    const stylesheet = Stylesheet.getInstance();
    stylesheet.setConfig({
      injectionMode: InjectionMode.none,
      namespace: "server",
    });
    stylesheet.reset();
    resetIds();

    // Styled components styles
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    // Merge all SSR styles
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        // Fluent UI
        styleTags: stylesheet.getRules(true),
        // Styled Components
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <html>
        <Head>
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: (this.props as any).styleTags }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
