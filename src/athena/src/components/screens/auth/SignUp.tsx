import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthParamList } from '../../navigation';
import {
  useEmailExistsLazyQuery,
  useSignUpMutation,
  useUserExistsLazyQuery,
  useUserExistsQuery,
} from '../../../lib/graphql';
import { Input } from '../../elements/Input';
import { Button } from '../../elements/Button';
import { object, string, number, date, InferType, ValidationError } from 'yup';

type ParamList = NativeStackScreenProps<AuthParamList, 'SignUp'>;
interface SignUpProps extends ParamList {}

interface SignUpInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

const initialValues: SignUpInput = {
  name: '',
  username: '',
  email: '',
  password: '',
};

export const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const [signup] = useSignUpMutation();
  const [usernameExists] = useUserExistsLazyQuery();
  const [emailExists] = useEmailExistsLazyQuery();

  const SignUpSchema = object({
    name: string().required(),
    username: string()
      .required()
      .test('', 'Username is not available.', async (username?: string) => {
        const { data } = await usernameExists({ variables: { username } });
        return !data?.usernameExists;
      }),
    email: string()
      .required()
      .email('Must provide valid email address.')
      .test('', 'This email is already used on another account.', async (email: string) => {
        const { data } = await emailExists({ variables: { email } });
        return !data?.emailExists;
      }),
    password: string()
      .required()
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
        'Password must be between 6 to 20 characters and contain at least 1 upper case letter, 1 lower case letter and 1 number.'
      ),
  });

  // TODO: this needs to be fixed
  const validate = async (values: SignUpInput) => {
    const errors: Record<string, string> = {};
    await SignUpSchema.validate(values, { abortEarly: false }).catch((err: ValidationError) => {
      err.inner.forEach(({ path, errors: errorMessage }) => {
        if (path && !errors[path]) {
          errors[path] = errorMessage[0];
        }
      });
    });
    return errors;
  };

  const onSubmit = async (values: SignUpInput) => {
    await signup({ variables: { input: values } });

    navigation.navigate('Login');
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <KeyboardAvoidingView style={styles.keyboardView} behavior={'padding'}>
            <Text style={{ ...styles.heading2, marginBottom: 20 }}>Create an Account.</Text>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                return (
                  <>
                    <Input
                      placeholder="name"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      autoCorrect={false}
                      autoCapitalize="none"
                      error={touched.name && !!errors.name}
                      onBlur={handleBlur('name')}
                      style={{ marginBottom: 14 }}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorMessageStyle}>{errors.name}</Text>
                    )}
                    <Input
                      placeholder="username"
                      value={values.username}
                      onChangeText={handleChange('username')}
                      autoCorrect={false}
                      autoCapitalize="none"
                      error={touched.username && !!errors.username}
                      onBlur={handleBlur('username')}
                      style={{ marginBottom: 14 }}
                    />
                    {touched.username && errors.username && (
                      <Text style={styles.errorMessageStyle}>{errors.username}</Text>
                    )}
                    <Input
                      placeholder="email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      autoCorrect={false}
                      autoCapitalize="none"
                      error={touched.email && !!errors.email}
                      onBlur={handleBlur('email')}
                      style={{ marginBottom: 14 }}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorMessageStyle}>{errors.email}</Text>
                    )}
                    <Input
                      value={values.password}
                      onChangeText={handleChange('password')}
                      placeholder="password"
                      textContentType="password"
                      autoCorrect={false}
                      autoCapitalize="none"
                      secureTextEntry={true}
                      error={touched.password && !!errors.password}
                      onBlur={handleBlur('password')}
                      style={{ marginBottom: 14 }}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorMessageStyle}>{errors.password}</Text>
                    )}
                    <View style={{ minHeight: 16, marginBottom: 30 }}></View>
                    <Button onPress={handleSubmit as () => void}>Sign Up</Button>
                  </>
                );
              }}
            </Formik>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    width: '100%',
  },
  keyboardView: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 99,
  },
  errorMessageStyle: {
    fontSize: 14,
    color: 'red',
    marginTop: -8,
    marginBottom: 6,
  },
});
