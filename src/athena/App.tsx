import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, retrieveToken } from './src/components/providers';

import { AuthNavigator } from './src/components/navigation';

// @ts-ignore
import { IP_ADDRESS, PORT } from '@env';

// api link
const httpLink = createHttpLink({
  uri: `http://${IP_ADDRESS}:${PORT}/graphql`,
});

// apply token to authorization header
const authLink = setContext(async (req, { headers }) => {
  const token = await retrieveToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

// export client object
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <AuthNavigator />
          </SafeAreaProvider>
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </ApolloProvider>
  );
}