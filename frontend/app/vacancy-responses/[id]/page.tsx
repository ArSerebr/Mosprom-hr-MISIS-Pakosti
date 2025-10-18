"use client";

import { AppShell } from "@/components/AppShell/AppShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  Stack,
  Title,
  Paper,
  Group,
  Text,
  Badge,
  Button,
  Table,
  Modal,
  Select,
  Avatar,
  Card,
  Anchor,
  ActionIcon,
  SimpleGrid,
  ThemeIcon,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconMail,
  IconPhone,
  IconFileText,
  IconEye,
  IconUser,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  getVacancy, 
  getVacancyApplications, 
  updateApplicationStatus,
  Application,
  Vacancy 
} from "@/lib/api";

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "orange",
    approve: "green",
    rejected: "red",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "На рассмотрении",
    approve: "Одобрено",
    rejected: "Отклонено",
  };
  return labels[status] || status;
};

export default function VacancyResponsesPage() {
  return (
    <ProtectedRoute>
      <VacancyResponsesContent />
    </ProtectedRoute>
  );
}

function VacancyResponsesContent() {
  const { token } = useAuth();
  const params = useParams();
  const vacancyId = parseInt(params.id as string);
  
  const [responses, setResponses] = useState<Application[]>([]);
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<Application | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, [vacancyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error("Токен авторизации не найден");
      }
      
      const [vacancyData, applicationsData] = await Promise.all([
        getVacancy(vacancyId),
        getVacancyApplications(vacancyId, token)
      ]);
      
      setVacancy(vacancyData);
      setResponses(applicationsData);
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось загрузить данные",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (response: Application) => {
    setSelectedResponse(response);
    open();
  };

  const handleStatusChange = async (id: number, newStatus: "pending" | "approve" | "rejected") => {
    try {
      if (!token) {
        throw new Error("Токен авторизации не найден");
      }
      
      await updateApplicationStatus(id, newStatus, token);
      setResponses(
        responses.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      notifications.show({
        title: "Успешно",
        message: "Статус отклика обновлен",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось обновить статус",
        color: "red",
      });
    }
  };

  const stats = {
    total: responses.length,
    pending: responses.filter((r) => r.status === "pending").length,
    approved: responses.filter((r) => r.status === "approve").length,
    rejected: responses.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <AppShell>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" />
            <Text>Загрузка откликов...</Text>
          </Stack>
        </Center>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Stack gap="lg">
        <Group>
          <ActionIcon component={Link} href="/vacancies" variant="light">
            <IconArrowLeft size={18} />
          </ActionIcon>
          <div>
            <Title order={1}>Отклики на вакансию</Title>
            <Text c="dimmed" size="sm">
              {vacancy?.vacancy_title || "Загрузка..."}
            </Text>
          </div>
        </Group>

        {/* Статистика */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="red" variant="light">
                <IconUser size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Всего откликов
                </Text>
                <Text size="xl" fw={700}>
                  {stats.total}
                </Text>
              </div>
            </Group>
          </Card>
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="green" variant="light">
                <IconClock size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  На рассмотрении
                </Text>
                <Text size="xl" fw={700}>
                  {stats.pending}
                </Text>
              </div>
            </Group>
          </Card>
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="orange" variant="light">
                <IconCheck size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Одобрено
                </Text>
                <Text size="xl" fw={700}>
                  {stats.approved}
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Список откликов */}
        <Paper p="md" radius="md" withBorder>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Кандидат</Table.Th>
                <Table.Th>Контакты</Table.Th>
                <Table.Th>Дата отклика</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {responses.map((response) => (
                <Table.Tr key={response.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="red" radius="xl">
                        {response.applicant_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <div>
                        <Text fw={500}>{response.applicant_name}</Text>
                        {response.status === "pending" && (
                          <Badge size="xs" color="orange" variant="dot">
                            На рассмотрении
                          </Badge>
                        )}
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Anchor
                          size="sm"
                          href={`mailto:${response.applicant_email}`}
                        >
                          {response.applicant_email}
                        </Anchor>
                      </Group>
                      <Group gap="xs">
                        <IconUser size={14} />
                        <Text size="sm">Не указан</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{new Date(response.created_at).toLocaleDateString()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Select
                      size="xs"
                      data={[
                        { value: "pending", label: "На рассмотрении" },
                        { value: "approve", label: "Одобрено" },
                        { value: "rejected", label: "Отклонено" },
                      ]}
                      value={response.status}
                      onChange={(value) =>
                        handleStatusChange(response.id, value as "pending" | "approve" | "rejected")
                      }
                    />
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconEye size={16} />}
                      onClick={() => handleView(response)}
                    >
                      Просмотреть
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      {/* Модальное окно просмотра отклика */}
      <Modal opened={opened} onClose={close} title="Отклик кандидата" size="lg">
        {selectedResponse && (
          <Stack>
            <Group>
              <Avatar size="xl" color="red" radius="xl">
                {selectedResponse.applicant_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </Avatar>
              <div>
                <Text size="xl" fw={700}>
                  {selectedResponse.applicant_name}
                </Text>
                <Badge
                  color={getStatusColor(selectedResponse.status)}
                  variant="light"
                >
                  {getStatusLabel(selectedResponse.status)}
                </Badge>
              </div>
            </Group>

            <Paper p="md" radius="md" withBorder>
              <Stack gap="md">
                <Group gap="xs">
                  <IconMail size={18} />
                  <Anchor href={`mailto:${selectedResponse.applicant_email}`}>
                    {selectedResponse.applicant_email}
                  </Anchor>
                </Group>
                <Group gap="xs">
                  <IconUser size={18} />
                  <Text>Не указан</Text>
                </Group>
              </Stack>
            </Paper>

            {selectedResponse.message && (
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  Сообщение кандидата
                </Text>
                <Paper p="md" radius="md" withBorder>
                  <Text>{selectedResponse.message}</Text>
                </Paper>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}
