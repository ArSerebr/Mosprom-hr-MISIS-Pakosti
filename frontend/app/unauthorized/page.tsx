'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Center,
  Box,
} from '@mantine/core';
import { IconShieldX, IconArrowLeft } from '@tabler/icons-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Container size={420} my={40}>
      <Center>
        <Box w="100%">
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack align="center">
              <IconShieldX size={64} color="red" />
              
              <Title order={2} ta="center">
                Доступ запрещен
              </Title>
              
              <Text color="dimmed" ta="center" size="sm">
                У вас нет прав для доступа к этой странице.
                Обратитесь к администратору для получения необходимых прав.
              </Text>

              <Button
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => router.back()}
                mt="md"
              >
                Назад
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Center>
    </Container>
  );
}
