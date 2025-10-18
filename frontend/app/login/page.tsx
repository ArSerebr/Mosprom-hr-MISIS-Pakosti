'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Alert,
  Anchor,
  Center,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconLogin } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Некорректный email'),
      password: (value) => (value.length < 6 ? 'Пароль должен содержать минимум 6 символов' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      setError(null);
      
      await login(values.email, values.password);
      
      notifications.show({
        title: 'Успешно',
        message: 'Вы успешно вошли в систему',
        color: 'green',
      });
      
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
      notifications.show({
        title: 'Ошибка',
        message: err.message || 'Не удалось войти в систему',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center>
        <Box w="100%">
          <Title ta="center" fw={900}>
            Добро пожаловать!
          </Title>
          <Text color="dimmed" size="sm" ta="center" mt={5}>
            Войдите в систему для продолжения
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                {error && (
                  <Alert icon={<IconAlertCircle size={16} />} title="Ошибка" color="red">
                    {error}
                  </Alert>
                )}

                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  required
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  label="Пароль"
                  placeholder="Ваш пароль"
                  required
                  {...form.getInputProps('password')}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={loading}
                  leftSection={<IconLogin size={16} />}
                >
                  Войти
                </Button>
              </Stack>
            </form>

            <Text ta="center" mt="md">
              Нет аккаунта?{' '}
              <Anchor<'a'> href="/register" fw={700}>
                Зарегистрироваться
              </Anchor>
            </Text>
          </Paper>
        </Box>
      </Center>
    </Container>
  );
}
