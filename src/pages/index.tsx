import { Heading, Page, Layout, Card } from "@shopify/polaris";
import React from "react";

const Index = () => (
  <Page>
    <Heading>Shopify app with Node and React 🎉</Heading>
    <Layout>
      <Layout.Section>
        <Card title="Order details" sectioned>
          <p>View a summary of your order.</p>
        </Card>
      </Layout.Section>
      <Layout.Section secondary>
        <Card title="Tags" sectioned>
          <p>Add tags to your order.</p>
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
);

export default Index;
