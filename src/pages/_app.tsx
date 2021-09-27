import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { AppContext, AppProps } from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import React from "react";

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function MyProvider(props) {
  const app = useAppBridge();

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
    </ApolloProvider>
  );
}

interface Props {
  pageProps: any;
  host: string;
}

const App = ({ Component, pageProps, host }: AppProps & Props) => {
  return (
    <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: process.env.API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <MyProvider Component={Component} {...pageProps} />
        </Provider>
      </AppProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }: AppContext): Promise<Props>  => {
  const componentGetInitialProps = Component.getInitialProps || (() => Promise.resolve());
  const [pageProps] = await Promise.all([componentGetInitialProps(ctx)]);
  return {
    pageProps,
    host: ctx.query.host as string,
  };
};

export default App;
