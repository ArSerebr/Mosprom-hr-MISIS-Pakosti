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
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconUserPlus } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: 'hr' as 'admin' | 'hr' | 'university',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Некорректный email'),
      password: (value) => {
        if (value.length < 8) return 'Пароль должен содержать минимум 8 символов';
        if (!/[A-Z]/.test(value)) return 'Пароль должен содержать заглавную букву';
        if (!/[a-z]/.test(value)) return 'Пароль должен содержать строчную букву';
        if (!/\d/.test(value)) return 'Пароль должен содержать цифру';
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Пароли не совпадают' : null,
      name: (value) => {
        if (value.length < 2) return 'Имя должно содержать минимум 2 символа';
        if (value.length > 100) return 'Имя не должно превышать 100 символов';
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      setError(null);
      
      await register(values.email, values.password, values.name, values.role);
      
      notifications.show({
        title: 'Успешно',
        message: 'Вы успешно зарегистрированы и вошли в систему',
        color: 'green',
      });
      
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
      notifications.show({
        title: 'Ошибка',
        message: err.message || 'Не удалось зарегистрироваться',
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
            Регистрация
          </Title>
          <Text color="dimmed" size="sm" ta="center" mt={5}>
            Создайте аккаунт для доступа к системе
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
                  label="Имя"
                  placeholder="Ваше имя"
                  required
                  {...form.getInputProps('name')}
                />

                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  required
                  {...form.getInputProps('email')}
                />

                <Select
                  label="Роль"
                  placeholder="Выберите роль"
                  required
                  data={[
                    { value: 'hr', label: 'HR-менеджер' },
                    { value: 'university', label: 'Представитель университета' },
                    { value: 'admin', label: 'Администратор' },
                  ]}
                  {...form.getInputProps('role')}
                />

                <PasswordInput
                  label="Пароль"
                  placeholder="Ваш пароль"
                  required
                  {...form.getInputProps('password')}
                />

                <PasswordInput
                  label="Подтвердите пароль"
                  placeholder="Повторите пароль"
                  required
                  {...form.getInputProps('confirmPassword')}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={loading}
                  leftSection={<IconUserPlus size={16} />}
                >
                  Зарегистрироваться
                </Button>
              </Stack>
            </form>

            <Text ta="center" mt="md">
              Уже есть аккаунт?{' '}
              <Anchor<'a'> href="/login" fw={700}>
                Войти
              </Anchor>
            </Text>
          </Paper>
        </Box>
      </Center>
    </Container>
  );
}
