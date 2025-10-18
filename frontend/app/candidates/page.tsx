"use client";

import { AppShell } from "@/components/AppShell/AppShell";
import { useState, useEffect } from "react";
import {
  Title,
  Button,
  Stack,
  Paper,
  Group,
  Text,
  Badge,
  TextInput,
  Select,
  Table,
  ActionIcon,
  Modal,
  Textarea,
  Grid,
  Avatar,
  Card,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconMail,
  IconPhone,
  IconBriefcase,
  IconUser,
  IconCheck,
  IconX,
  IconClock,
  IconStar,
  IconSchool,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { getAllCandidates, updateApplicationStatus, createCandidate } from "@/lib/api";
import { Application, Vacancy } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Преобразование Application в Candidate для совместимости с UI
const applicationToCandidate = (app: Application) => ({
  id: app.id,
  name: app.applicant_name,
  email: app.applicant_email,
  phone: "", // В базе нет телефона
  position: app.vacancy_data?.vacancy_title || "Не указана",
  experience: "", // В базе нет опыта
  skills: [], // В базе нет навыков
  status: app.status,
  source: "Отклик на вакансию",
  notes: app.message || "",
  resumeUrl: undefined,
  vacancyId: app.vacancy,
  vacancy: app.vacancy_data,
  university: "", // Удалено поле applicant_university
  message: app.message,
  created_at: app.created_at,
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "blue",
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

export default function CandidatesPage() {
  const { user, token } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [vacancyFilter, setVacancyFilter] = useState<string | null>("all");
  const [opened, { open, close }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      skills: "",
      source: "",
      notes: "",
      vacancyId: "",
    },
  });

  // Загрузка кандидатов при монтировании компонента
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const applications = await getAllCandidates(token);
      const candidatesData = applications.map(applicationToCandidate);
      setCandidates(candidatesData);
    } catch (error) {
      console.error("Ошибка загрузки кандидатов:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось загрузить кандидатов",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Получить список уникальных вакансий
  const uniqueVacancies = Array.from(
    new Map(
      candidates
        .filter((c) => c.vacancy)
        .map((c) => [c.vacancy!.id, c.vacancy!])
    ).values()
  );

  const handleCreate = () => {
    setEditMode(false);
    form.reset();
    open();
  };

  const handleEdit = (candidate: any) => {
    setEditMode(true);
    setSelectedCandidate(candidate);
    form.setValues({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      experience: candidate.experience,
      skills: candidate.skills.join(", "),
      source: candidate.source,
      notes: candidate.notes,
      // university: candidate.university || "", // Поле удалено
      vacancyId: candidate.vacancyId?.toString() || "",
    });
    open();
  };

  const handleView = (candidate: any) => {
    setSelectedCandidate(candidate);
    openView();
  };

  const handleDelete = async (id: number) => {
    // В реальном приложении здесь должен быть API для удаления
    setCandidates(candidates.filter((c) => c.id !== id));
    notifications.show({
      title: "Успешно",
      message: "Кандидат удален",
      color: "green",
    });
  };

  const handleStatusChange = async (id: number, newStatus: "pending" | "approve" | "rejected") => {
    if (!token) return;
    
    try {
      await updateApplicationStatus(id, newStatus, token);
      setCandidates(
        candidates.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      notifications.show({
        title: "Успешно",
        message: "Статус обновлен",
        color: "green",
      });
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось обновить статус",
        color: "red",
      });
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!token) {
      notifications.show({
        title: "Ошибка",
        message: "Необходима авторизация",
        color: "red",
      });
      return;
    }

    try {
      const candidateData = {
        vacancy_id: values.vacancyId ? parseInt(values.vacancyId) : null,
        applicant_name: values.name,
        applicant_email: values.email,
        // applicant_university: values.university || "Не указан", // Поле удалено
        message: values.notes || "",
      };

      const newCandidate = await createCandidate(candidateData, token);
      const candidate = applicationToCandidate(newCandidate);
      
      setCandidates([candidate, ...candidates]);
      
      notifications.show({
        title: "Успешно",
        message: "Кандидат добавлен",
        color: "green",
      });
      
      close();
    } catch (error) {
      console.error("Ошибка создания кандидата:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось создать кандидата",
        color: "red",
      });
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (candidate.vacancy?.vacancy_title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;
    const matchesVacancy =
      vacancyFilter === "all" ||
      candidate.vacancyId?.toString() === vacancyFilter;
    return matchesSearch && matchesStatus && matchesVacancy;
  });

  const stats = {
    total: candidates.length,
    pending: candidates.filter((c) => c.status === "pending").length,
    approve: candidates.filter((c) => c.status === "approve").length,
    rejected: candidates.filter((c) => c.status === "rejected").length,
  };

  if (loading) {
    return (
      <AppShell>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" />
            <Text>Загрузка кандидатов...</Text>
          </Stack>
        </Center>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Кандидаты</Title>
          <Button leftSection={<IconPlus size={18} />} onClick={handleCreate}>
            Добавить кандидата
          </Button>
        </Group>

        {/* Статистика */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="red" variant="light">
                <IconUser size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Всего
                </Text>
                <Text size="xl" fw={700}>
                  {stats.total}
                </Text>
              </div>
            </Group>
          </Card>
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="red" variant="light">
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
              <ThemeIcon size="xl" radius="md" color="green" variant="light">
                <IconCheck size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Одобрено
                </Text>
                <Text size="xl" fw={700}>
                  {stats.approve}
                </Text>
              </div>
            </Group>
          </Card>
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="red" variant="light">
                <IconX size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Отклонено
                </Text>
                <Text size="xl" fw={700}>
                  {stats.rejected}
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        <Paper p="md" radius="md" withBorder>
          <Stack gap="md">
            <Group>
              <TextInput
                placeholder="Поиск кандидатов..."
                leftSection={<IconSearch size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Статус"
                data={[
                  { value: "all", label: "Все" },
                  { value: "pending", label: "На рассмотрении" },
                  { value: "approve", label: "Одобрено" },
                  { value: "rejected", label: "Отклонено" },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                w={200}
              />
              <Select
                placeholder="Вакансия"
                leftSection={<IconBriefcase size={18} />}
                data={[
                  { value: "all", label: "Все вакансии" },
                  ...uniqueVacancies.map((v) => ({
                    value: v.id.toString(),
                    label: v.vacancy_title,
                  })),
                ]}
                value={vacancyFilter}
                onChange={setVacancyFilter}
                w={250}
              />
            </Group>
          </Stack>

          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Кандидат</Table.Th>
                <Table.Th>Вакансия</Table.Th>
                <Table.Th>Контакты</Table.Th>
                <Table.Th>Университет</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCandidates.map((candidate) => (
                <Table.Tr key={candidate.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="red" radius="xl">
                        {candidate.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </Avatar>
                      <div>
                        <Text fw={500}>{candidate.name}</Text>
                        <Text size="xs" c="dimmed">
                          {candidate.source}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {candidate.vacancy ? (
                      <div>
                        <Text fw={500} size="sm">
                          {candidate.vacancy.vacancy_title}
                        </Text>
                        <Group gap={4}>
                          <Text size="xs" c="dimmed">
                            {candidate.vacancy.company_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            •
                          </Text>
                          <Text size="xs" c="dimmed">
                            {candidate.vacancy.salary || "Зарплата не указана"}
                          </Text>
                        </Group>
                      </div>
                    ) : (
                      <Text size="sm" c="dimmed">
                        Не указана
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Anchor size="sm" href={`mailto:${candidate.email}`}>
                          {candidate.email}
                        </Anchor>
                      </Group>
                      {candidate.phone && (
                        <Group gap="xs">
                          <IconPhone size={14} />
                          <Text size="sm">{candidate.phone}</Text>
                        </Group>
                      )}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconSchool size={16} />
                      <Text size="sm">Не указан</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Select
                      size="xs"
                      data={[
                        { value: "pending", label: "На рассмотрении" },
                        { value: "approve", label: "Одобрено" },
                        { value: "rejected", label: "Отклонено" },
                      ]}
                      value={candidate.status}
                      onChange={(value) =>
                        handleStatusChange(
                          candidate.id,
                          value as "pending" | "approve" | "rejected"
                        )
                      }
                      styles={{
                        input: {
                          color:
                            candidate.status === "approve"
                              ? "green"
                              : candidate.status === "rejected"
                              ? "red"
                              : undefined,
                        },
                      }}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleView(candidate)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="orange"
                        onClick={() => handleEdit(candidate)}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      {/* Модальное окно создания/редактирования */}
      <Modal
        opened={opened}
        onClose={close}
        title={editMode ? "Редактировать кандидата" : "Добавить кандидата"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="ФИО"
              placeholder="Иван Иванов"
              required
              {...form.getInputProps("name")}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  placeholder="ivan@email.com"
                  type="email"
                  required
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Телефон"
                  placeholder="+7 (999) 123-45-67"
                  {...form.getInputProps("phone")}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Позиция"
                  placeholder="Frontend Developer"
                  required
                  {...form.getInputProps("position")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                {/* Поле университета удалено */}
              </Grid.Col>
            </Grid>
            <TextInput
              label="Навыки (через запятую)"
              placeholder="React, TypeScript, Next.js"
              {...form.getInputProps("skills")}
            />
            <TextInput
              label="Источник"
              placeholder="hh.ru, LinkedIn, рекомендация..."
              {...form.getInputProps("source")}
            />
            <Select
              label="Вакансия (опционально)"
              placeholder="Выберите вакансию"
              description="Укажите на какую вакансию откликнулся кандидат"
              leftSection={<IconBriefcase size={18} />}
              data={[
                { value: "", label: "Без привязки к вакансии" },
                ...uniqueVacancies.map((v) => ({
                  value: v.id.toString(),
                  label: `${v.vacancy_title} - ${v.company_name} (${v.salary || "Зарплата не указана"})`,
                })),
              ]}
              {...form.getInputProps("vacancyId")}
              searchable
            />
            <Textarea
              label="Заметки"
              placeholder="Дополнительная информация о кандидате..."
              minRows={3}
              {...form.getInputProps("notes")}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>
                Отмена
              </Button>
              <Button type="submit">
                {editMode ? "Сохранить" : "Добавить"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Модальное окно просмотра */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title="Профиль кандидата"
        size="lg"
      >
        {selectedCandidate && (
          <Stack>
            <Group>
              <Avatar size="xl" color="red" radius="xl">
                {selectedCandidate.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </Avatar>
              <div>
                <Text size="xl" fw={700}>
                  {selectedCandidate.name}
                </Text>
                <Text c="dimmed">{selectedCandidate.position}</Text>
              </div>
            </Group>

            <Paper p="md" radius="md" withBorder>
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Email
                  </Text>
                  <Anchor href={`mailto:${selectedCandidate.email}`}>
                    {selectedCandidate.email}
                  </Anchor>
                </div>
                {selectedCandidate.phone && (
                  <div>
                    <Text size="sm" c="dimmed" mb={4}>
                      Телефон
                    </Text>
                    <Text>{selectedCandidate.phone}</Text>
                  </div>
                )}
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Университет
                  </Text>
                  <Text>Не указан</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Источник
                  </Text>
                  <Text>{selectedCandidate.source}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Статус
                  </Text>
                  <Badge
                    color={getStatusColor(selectedCandidate.status)}
                    variant="light"
                    size="lg"
                  >
                    {getStatusLabel(selectedCandidate.status)}
                  </Badge>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Дата отклика
                  </Text>
                  <Text>{new Date(selectedCandidate.created_at).toLocaleDateString('ru-RU')}</Text>
                </div>
              </Stack>
            </Paper>

            {/* Информация о вакансии */}
            {selectedCandidate.vacancy && (
              <div>
                <Text size="sm" c="dimmed" mb={8}>
                  Откликнулся на вакансию
                </Text>
                <Card padding="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <div>
                      <Text fw={600} size="lg">
                        {selectedCandidate.vacancy.vacancy_title}
                      </Text>
                      <Text c="dimmed" size="sm">
                        {selectedCandidate.vacancy.company_name}
                      </Text>
                    </div>

                    <SimpleGrid cols={2} spacing="xs">
                      <div>
                        <Text size="xs" c="dimmed">
                          Специальность
                        </Text>
                        <Text size="sm">
                          {selectedCandidate.vacancy.specialty}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Локация
                        </Text>
                        <Text size="sm">
                          {selectedCandidate.vacancy.location || "Не указана"}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Зарплата
                        </Text>
                        <Text size="sm" fw={500}>
                          {selectedCandidate.vacancy.salary || "Не указана"}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Занятость
                        </Text>
                        <Text size="sm">
                          {selectedCandidate.vacancy.employment_type || "Не указана"}
                        </Text>
                      </div>
                    </SimpleGrid>
                  </Stack>
                </Card>
              </div>
            )}

            {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
              <div>
                <Text size="sm" c="dimmed" mb={8}>
                  Навыки
                </Text>
                <Group gap="xs">
                  {selectedCandidate.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="light">
                      {skill}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}

            {selectedCandidate.message && (
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  Сообщение от кандидата
                </Text>
                <Paper p="md" radius="md" withBorder>
                  <Text>{selectedCandidate.message}</Text>
                </Paper>
              </div>
            )}

            {selectedCandidate.notes && (
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  Заметки
                </Text>
                <Paper p="md" radius="md" withBorder>
                  <Text>{selectedCandidate.notes}</Text>
                </Paper>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}