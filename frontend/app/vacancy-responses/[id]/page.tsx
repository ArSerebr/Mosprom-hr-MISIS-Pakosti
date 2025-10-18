"use client";

import { AppShell } from "@/components/AppShell/AppShell";
import { useState } from "react";
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

const mockResponses = [
  {
    id: 1,
    candidateName: "Алексей Иванов",
    candidateEmail: "alex.ivanov@email.com",
    candidatePhone: "+7 (999) 123-45-67",
    resumeUrl: "/resumes/alexivanov.pdf",
    status: "new",
    createdAt: "2025-10-17 10:30",
    resumeData: {
      position: "Frontend Developer",
      experience: "5 лет",
      education: "МГУ, Прикладная математика",
      skills: ["React", "TypeScript", "Next.js", "CSS"],
      about:
        "Опытный frontend разработчик с 5-летним стажем. Специализируюсь на React и TypeScript.",
    },
  },
  {
    id: 2,
    candidateName: "Мария Петрова",
    candidateEmail: "maria.petrova@email.com",
    candidatePhone: "+7 (999) 234-56-78",
    resumeUrl: "/resumes/mariapetrova.pdf",
    status: "viewed",
    createdAt: "2025-10-16 15:20",
    resumeData: {
      position: "Frontend Developer",
      experience: "3 года",
      education: "МФТИ, Информатика",
      skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
      about: "Увлеченный разработчик с желанием расти и развиваться.",
    },
  },
  {
    id: 3,
    candidateName: "Дмитрий Сидоров",
    candidateEmail: "dmitry.sidorov@email.com",
    candidatePhone: "+7 (999) 345-67-89",
    status: "interview",
    createdAt: "2025-10-15 11:45",
    coverLetter:
      "Здравствуйте! Заинтересован в вашей вакансии, имею релевантный опыт...",
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    new: "blue",
    viewed: "cyan",
    interview: "orange",
    rejected: "red",
    accepted: "green",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    new: "Новый",
    viewed: "Просмотрен",
    interview: "Интервью",
    rejected: "Отказ",
    accepted: "Принят",
  };
  return labels[status] || status;
};

export default function VacancyResponsesPage() {
  const [responses, setResponses] = useState(mockResponses);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleView = (response: any) => {
    setSelectedResponse(response);
    if (response.status === "new") {
      setResponses(
        responses.map((r) =>
          r.id === response.id ? { ...r, status: "viewed" } : r
        )
      );
    }
    open();
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setResponses(
      responses.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    notifications.show({
      title: "Успешно",
      message: "Статус отклика обновлен",
      color: "green",
    });
  };

  const stats = {
    total: responses.length,
    new: responses.filter((r) => r.status === "new").length,
    interview: responses.filter((r) => r.status === "interview").length,
  };

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
              Senior Frontend Developer
            </Text>
          </div>
        </Group>

        {/* Статистика */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="blue" variant="light">
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
                  Новых
                </Text>
                <Text size="xl" fw={700}>
                  {stats.new}
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
                  На интервью
                </Text>
                <Text size="xl" fw={700}>
                  {stats.interview}
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
                      <Avatar color="blue" radius="xl">
                        {response.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <div>
                        <Text fw={500}>{response.candidateName}</Text>
                        {response.status === "new" && (
                          <Badge size="xs" color="blue" variant="dot">
                            Новый
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
                          href={`mailto:${response.candidateEmail}`}
                        >
                          {response.candidateEmail}
                        </Anchor>
                      </Group>
                      {response.candidatePhone && (
                        <Group gap="xs">
                          <IconPhone size={14} />
                          <Text size="sm">{response.candidatePhone}</Text>
                        </Group>
                      )}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{response.createdAt}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Select
                      size="xs"
                      data={[
                        { value: "new", label: "Новый" },
                        { value: "viewed", label: "Просмотрен" },
                        { value: "interview", label: "Интервью" },
                        { value: "accepted", label: "Принят" },
                        { value: "rejected", label: "Отказ" },
                      ]}
                      value={response.status}
                      onChange={(value) =>
                        handleStatusChange(response.id, value!)
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
              <Avatar size="xl" color="blue" radius="xl">
                {selectedResponse.candidateName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </Avatar>
              <div>
                <Text size="xl" fw={700}>
                  {selectedResponse.candidateName}
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
                  <Anchor href={`mailto:${selectedResponse.candidateEmail}`}>
                    {selectedResponse.candidateEmail}
                  </Anchor>
                </Group>
                {selectedResponse.candidatePhone && (
                  <Group gap="xs">
                    <IconPhone size={18} />
                    <Text>{selectedResponse.candidatePhone}</Text>
                  </Group>
                )}
              </Stack>
            </Paper>

            {selectedResponse.resumeUrl && (
              <Button
                leftSection={<IconFileText size={18} />}
                variant="light"
                component="a"
                href={selectedResponse.resumeUrl}
                target="_blank"
              >
                Скачать резюме (PDF)
              </Button>
            )}

            {selectedResponse.resumeData && (
              <Paper p="md" radius="md" withBorder>
                <Stack gap="md">
                  <div>
                    <Text size="sm" c="dimmed" mb={4}>
                      Желаемая позиция
                    </Text>
                    <Text fw={500}>{selectedResponse.resumeData.position}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" mb={4}>
                      Опыт работы
                    </Text>
                    <Text>{selectedResponse.resumeData.experience}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" mb={4}>
                      Образование
                    </Text>
                    <Text>{selectedResponse.resumeData.education}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" mb={8}>
                      Навыки
                    </Text>
                    <Group gap="xs">
                      {selectedResponse.resumeData.skills.map(
                        (skill: string, index: number) => (
                          <Badge key={index} variant="light">
                            {skill}
                          </Badge>
                        )
                      )}
                    </Group>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" mb={4}>
                      О себе
                    </Text>
                    <Text>{selectedResponse.resumeData.about}</Text>
                  </div>
                </Stack>
              </Paper>
            )}

            {selectedResponse.coverLetter && (
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  Сопроводительное письмо
                </Text>
                <Paper p="md" radius="md" withBorder>
                  <Text>{selectedResponse.coverLetter}</Text>
                </Paper>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}
