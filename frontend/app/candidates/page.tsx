"use client";

import { AppShell } from "@/components/AppShell/AppShell";
import { useState } from "react";
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
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

interface Vacancy {
  id: number;
  title: string;
  company: string;
  department: string;
  location: string;
  salary: string;
  employmentType: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string[];
  status: "new" | "interview" | "test-task" | "offer" | "accepted" | "rejected";
  source: string;
  notes: string;
  resumeUrl?: string;
  // Привязка к вакансии
  vacancyId?: number;
  vacancy?: Vacancy;
}

// Моковые вакансии для привязки
const mockVacancies: Vacancy[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "ТехКомпания",
    department: "IT",
    location: "Москва",
    salary: "200 000 - 300 000 ₽",
    employmentType: "Полная занятость",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Стартап АБВ",
    department: "Продукт",
    location: "Москва",
    salary: "250 000 - 350 000 ₽",
    employmentType: "Полная занятость",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Дизайн Студия",
    department: "Дизайн",
    location: "Удаленно",
    salary: "150 000 - 220 000 ₽",
    employmentType: "Полная занятость",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "ТехКомпания",
    department: "IT",
    location: "Москва",
    salary: "180 000 - 280 000 ₽",
    employmentType: "Полная занятость",
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "АналитикПро",
    department: "Аналитика",
    location: "Москва",
    salary: "120 000 - 180 000 ₽",
    employmentType: "Полная занятость",
  },
];

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Алексей Иванов",
    email: "alex.ivanov@email.com",
    phone: "+7 (999) 123-45-67",
    position: "Frontend Developer",
    experience: "5 лет",
    skills: ["React", "TypeScript", "Next.js", "CSS"],
    status: "interview",
    source: "hh.ru",
    notes: "Сильный кандидат, хорошие технические навыки",
    vacancyId: 1,
    vacancy: mockVacancies[0],
  },
  {
    id: 2,
    name: "Мария Петрова",
    email: "maria.petrova@email.com",
    phone: "+7 (999) 234-56-78",
    position: "Product Manager",
    experience: "7 лет",
    skills: ["Product Management", "Agile", "Analytics", "Leadership"],
    status: "offer",
    source: "LinkedIn",
    notes: "Опытный PM с отличными рекомендациями",
    vacancyId: 2,
    vacancy: mockVacancies[1],
  },
  {
    id: 3,
    name: "Дмитрий Сидоров",
    email: "dmitry.sidorov@email.com",
    phone: "+7 (999) 345-67-89",
    position: "UX Designer",
    experience: "3 года",
    skills: ["Figma", "User Research", "Prototyping", "UI Design"],
    status: "new",
    source: "Рекомендация",
    notes: "Молодой специалист с хорошим портфолио",
    vacancyId: 3,
    vacancy: mockVacancies[2],
  },
  {
    id: 4,
    name: "Екатерина Смирнова",
    email: "kate.smirnova@email.com",
    phone: "+7 (999) 456-78-90",
    position: "Backend Developer",
    experience: "4 года",
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    status: "test-task",
    source: "hh.ru",
    notes: "Прошла первое интервью, отправлено тестовое задание",
    vacancyId: 4,
    vacancy: mockVacancies[3],
  },
  {
    id: 5,
    name: "Иван Кузнецов",
    email: "ivan.kuznetsov@email.com",
    phone: "+7 (999) 567-89-01",
    position: "Data Analyst",
    experience: "2 года",
    skills: ["SQL", "Python", "Tableau", "Excel"],
    status: "new",
    source: "Сайт компании",
    notes: "Недавний выпускник с хорошими знаниями",
    vacancyId: 5,
    vacancy: mockVacancies[4],
  },
  {
    id: 6,
    name: "Анна Волкова",
    email: "anna.volkova@email.com",
    phone: "+7 (999) 678-90-12",
    position: "Frontend Developer",
    experience: "6 лет",
    skills: ["React", "Vue.js", "JavaScript", "Node.js"],
    status: "accepted",
    source: "LinkedIn",
    notes: "Приняла оффер, выходит через 2 недели",
    vacancyId: 1,
    vacancy: mockVacancies[0],
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    new: "blue",
    interview: "orange",
    "test-task": "yellow",
    offer: "teal",
    accepted: "green",
    rejected: "red",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    new: "Новый",
    interview: "Интервью",
    "test-task": "Тестовое",
    offer: "Оффер",
    accepted: "Принято",
    rejected: "Отказ",
  };
  return labels[status] || status;
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [vacancyFilter, setVacancyFilter] = useState<string | null>("all");
  const [opened, { open, close }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
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

  const handleEdit = (candidate: Candidate) => {
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
      vacancyId: candidate.vacancyId?.toString() || "",
    });
    open();
  };

  const handleView = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    openView();
  };

  const handleDelete = (id: number) => {
    setCandidates(candidates.filter((c) => c.id !== id));
    notifications.show({
      title: "Успешно",
      message: "Кандидат удален",
      color: "green",
    });
  };

  const handleStatusChange = (id: number, newStatus: Candidate["status"]) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    notifications.show({
      title: "Успешно",
      message: "Статус обновлен",
      color: "green",
    });
  };

  const handleSubmit = (values: typeof form.values) => {
    const vacancyId = values.vacancyId ? parseInt(values.vacancyId) : undefined;
    const vacancy = vacancyId
      ? mockVacancies.find((v) => v.id === vacancyId)
      : undefined;

    if (editMode && selectedCandidate) {
      setCandidates(
        candidates.map((c) =>
          c.id === selectedCandidate.id
            ? {
                ...c,
                name: values.name,
                email: values.email,
                phone: values.phone,
                position: values.position,
                experience: values.experience,
                source: values.source,
                notes: values.notes,
                skills: values.skills.split(",").map((s) => s.trim()),
                vacancyId,
                vacancy,
              }
            : c
        )
      );
      notifications.show({
        title: "Успешно",
        message: "Кандидат обновлен",
        color: "green",
      });
    } else {
      const newCandidate: Candidate = {
        id: Math.max(...candidates.map((c) => c.id)) + 1,
        name: values.name,
        email: values.email,
        phone: values.phone,
        position: values.position,
        experience: values.experience,
        source: values.source,
        notes: values.notes,
        skills: values.skills.split(",").map((s) => s.trim()),
        status: "new",
        vacancyId,
        vacancy,
      };
      setCandidates([...candidates, newCandidate]);
      notifications.show({
        title: "Успешно",
        message: "Кандидат добавлен",
        color: "green",
      });
    }
    close();
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (candidate.vacancy?.title || "")
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
    new: candidates.filter((c) => c.status === "new").length,
    interview: candidates.filter((c) => c.status === "interview").length,
    offers: candidates.filter((c) => c.status === "offer").length,
  };

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
              <ThemeIcon size="xl" radius="md" color="blue" variant="light">
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
              <ThemeIcon size="xl" radius="md" color="green" variant="light">
                <IconStar size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Новые
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
                <IconClock size={24} />
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
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="teal" variant="light">
                <IconCheck size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Офферы
                </Text>
                <Text size="xl" fw={700}>
                  {stats.offers}
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
                  { value: "new", label: "Новые" },
                  { value: "interview", label: "Интервью" },
                  { value: "test-task", label: "Тестовое" },
                  { value: "offer", label: "Оффер" },
                  { value: "accepted", label: "Принято" },
                  { value: "rejected", label: "Отказ" },
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
                    label: v.title,
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
                <Table.Th>Опыт</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCandidates.map((candidate) => (
                <Table.Tr key={candidate.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="blue" radius="xl">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
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
                          {candidate.vacancy.title}
                        </Text>
                        <Group gap={4}>
                          <Text size="xs" c="dimmed">
                            {candidate.vacancy.company}
                          </Text>
                          <Text size="xs" c="dimmed">
                            •
                          </Text>
                          <Text size="xs" c="dimmed">
                            {candidate.vacancy.salary}
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
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">{candidate.phone}</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconBriefcase size={16} />
                      {candidate.experience}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Select
                      size="xs"
                      data={[
                        { value: "new", label: "Новый" },
                        { value: "interview", label: "Интервью" },
                        { value: "test-task", label: "Тестовое" },
                        { value: "offer", label: "Оффер" },
                        { value: "accepted", label: "Принято" },
                        { value: "rejected", label: "Отказ" },
                      ]}
                      value={candidate.status}
                      onChange={(value) =>
                        handleStatusChange(
                          candidate.id,
                          value as Candidate["status"]
                        )
                      }
                      styles={{
                        input: {
                          color:
                            candidate.status === "accepted"
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
                        color="blue"
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
                  required
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
                <TextInput
                  label="Опыт работы"
                  placeholder="5 лет"
                  required
                  {...form.getInputProps("experience")}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Навыки (через запятую)"
              placeholder="React, TypeScript, Next.js"
              required
              {...form.getInputProps("skills")}
            />
            <TextInput
              label="Источник"
              placeholder="hh.ru, LinkedIn, рекомендация..."
              required
              {...form.getInputProps("source")}
            />
            <Select
              label="Вакансия (опционально)"
              placeholder="Выберите вакансию"
              description="Укажите на какую вакансию откликнулся кандидат"
              leftSection={<IconBriefcase size={18} />}
              data={[
                { value: "", label: "Без привязки к вакансии" },
                ...mockVacancies.map((v) => ({
                  value: v.id.toString(),
                  label: `${v.title} - ${v.company} (${v.salary})`,
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
              <Avatar size="xl" color="blue" radius="xl">
                {selectedCandidate.name
                  .split(" ")
                  .map((n) => n[0])
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
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Телефон
                  </Text>
                  <Text>{selectedCandidate.phone}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Опыт работы
                  </Text>
                  <Text>{selectedCandidate.experience}</Text>
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
                        {selectedCandidate.vacancy.title}
                      </Text>
                      <Text c="dimmed" size="sm">
                        {selectedCandidate.vacancy.company}
                      </Text>
                    </div>

                    <SimpleGrid cols={2} spacing="xs">
                      <div>
                        <Text size="xs" c="dimmed">
                          Отдел
                        </Text>
                        <Text size="sm">
                          {selectedCandidate.vacancy.department}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Локация
                        </Text>
                        <Text size="sm">
                          {selectedCandidate.vacancy.location}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Зарплата
                        </Text>
                        <Text size="sm" fw={500}>
                          {selectedCandidate.vacancy.salary}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Занятость
                        </Text>
                        <Text size="sm">
                          {selectedCandidate.vacancy.employmentType}
                        </Text>
                      </div>
                    </SimpleGrid>
                  </Stack>
                </Card>
              </div>
            )}

            <div>
              <Text size="sm" c="dimmed" mb={8}>
                Навыки
              </Text>
              <Group gap="xs">
                {selectedCandidate.skills.map((skill, index) => (
                  <Badge key={index} variant="light">
                    {skill}
                  </Badge>
                ))}
              </Group>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb={4}>
                Заметки
              </Text>
              <Paper p="md" radius="md" withBorder>
                <Text>{selectedCandidate.notes}</Text>
              </Paper>
            </div>
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}
