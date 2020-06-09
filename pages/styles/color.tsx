import Head from "next/head";
/**
 * Import helpers and GetStaticProps type
 */
import { getGithubPreviewProps, parseMarkdown } from "next-tinacms-github";
import { GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import {
  useGithubMarkdownForm,
  useGithubToolbarPlugins,
} from "react-tinacms-github";
import { usePlugins } from "tinacms";
import { InlineForm } from "react-tinacms-inline";
import { MarkdownFieldPlugin, InlineWysiwyg } from "react-tinacms-editor";

export default function StylesColor({ file }) {
  const formOptions = {
    label: "Styles Color",
    fields: [{ name: "markdownBody", component: "markdown" }],
  };

  const [data, form] = useGithubMarkdownForm(file, formOptions);
  usePlugins([MarkdownFieldPlugin, form]);

  useGithubToolbarPlugins();

  return (
    <InlineForm form={form}>
      <InlineWysiwyg name="markdownBody" format="markdown">
        <ReactMarkdown source={data.markdownBody} />
      </InlineWysiwyg>
    </InlineForm>
  );
}

/**
 * Fetch data with getStaticProps based on 'preview' mode
 */
export const getStaticProps: GetStaticProps = async function ({
  preview,
  previewData,
}) {
  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: "content/styles.md",
      parse: parseMarkdown,
    });
  }
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: "content/styles.md",
        data: (await require("../../content/styles.md")).default,
      },
    },
  };
};
