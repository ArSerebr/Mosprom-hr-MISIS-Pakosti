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
  NumberInput,
  Grid,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconMapPin,
  IconCurrencyRubel,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { DateTimePicker } from "@mantine/dates";
import { useRouter } from "next/navigation";

interface Vacancy {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salary: string;
  candidates: number;
  status: "draft" | "pending" | "active" | "paused" | "closed";
  description: string;
  requirements: string;
  contactEmail?: string;
  contactPhone?: string;
  autoUnpublishDate?: Date | null;
}

const mockVacancies: Vacancy[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "IT",
    location: "Москва",
    employmentType: "Полная занятость",
    salary: "200 000 - 300 000 ₽",
    candidates: 23,
    status: "active",
    description: "Разработка современных веб-приложений",
    requirements: "React, TypeScript, 5+ лет опыта",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Продукт",
    location: "Москва",
    employmentType: "Полная занятость",
    salary: "250 000 - 350 000 ₽",
    candidates: 45,
    status: "active",
    description: "Управление продуктовой командой",
    requirements: "Опыт в продуктовом менеджменте 3+ года",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    department: "Дизайн",
    location: "Удаленно",
    employmentType: "Полная занятость",
    salary: "150 000 - 220 000 ₽",
    candidates: 18,
    status: "active",
    description: "Проектирование пользовательских интерфейсов",
    requirements: "Figma, опыт 2+ года",
  },
  {
    id: 4,
    title: "Backend Developer",
    department: "IT",
    location: "Москва",
    employmentType: "Полная занятость",
    salary: "180 000 - 280 000 ₽",
    candidates: 31,
    status: "paused",
    description: "Разработка серверной части приложений",
    requirements: "Python/FastAPI, PostgreSQL, 3+ года опыта",
  },
  {
    id: 5,
    title: "Data Analyst",
    department: "Аналитика",
    location: "Москва",
    employmentType: "Полная занятость",
    salary: "120 000 - 180 000 ₽",
    candidates: 12,
    status: "active",
    description: "Анализ данных и построение отчетов",
    requirements: "SQL, Python, Excel, опыт 2+ года",
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: "gray",
    pending: "orange",
    active: "green",
    paused: "yellow",
    closed: "gray",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: "Черновик",
    pending: "На модерации",
    active: "Активна",
    paused: "На паузе",
    closed: "Закрыта",
  };
  return labels[status] || status;
};

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(mockVacancies);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [opened, { open, close }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [editMode, setEditMode] = useState(false);

  const router = useRouter();

  const form = useForm({
    initialValues: {
      title: "",
      department: "",
      location: "",
      employmentType: "",
      salary: "",
      description: "",
      requirements: "",
      contactEmail: "",
      contactPhone: "",
      autoUnpublishDate: null as Date | null,
    },
  });

  const handleCreate = () => {
    setEditMode(false);
    form.reset();
    open();
  };

  const handleEdit = (vacancy: Vacancy) => {
    setEditMode(true);
    setSelectedVacancy(vacancy);
    form.setValues({
      title: vacancy.title,
      department: vacancy.department,
      location: vacancy.location,
      employmentType: vacancy.employmentType,
      salary: vacancy.salary,
      description: vacancy.description,
      requirements: vacancy.requirements,
      contactEmail: vacancy.contactEmail || "",
      contactPhone: vacancy.contactPhone || "",
      autoUnpublishDate: vacancy.autoUnpublishDate || null,
    });
    open();
  };

  const handleViewResponses = (vacancyId: number) => {
    router.push(`/vacancy-responses/${vacancyId}`);
  };

  const handleView = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    openView();
  };

  const handleDelete = (id: number) => {
    setVacancies(vacancies.filter((v) => v.id !== id));
    notifications.show({
      title: "Успешно",
      message: "Вакансия удалена",
      color: "green",
    });
  };

  const handleSubmit = (values: typeof form.values) => {
    if (editMode && selectedVacancy) {
      setVacancies(
        vacancies.map((v) =>
          v.id === selectedVacancy.id ? { ...v, ...values } : v
        )
      );
      notifications.show({
        title: "Успешно",
        message: "Вакансия обновлена",
        color: "green",
      });
    } else {
      const newVacancy: Vacancy = {
        id: Math.max(...vacancies.map((v) => v.id)) + 1,
        ...values,
        candidates: 0,
        status: "pending",
        autoUnpublishDate: values.autoUnpublishDate,
      };
      setVacancies([...vacancies, newVacancy]);
      notifications.show({
        title: "Успешно",
        message: "Вакансия отправлена на модерацию",
        color: "green",
      });
    }
    close();
  };

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vacancy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Вакансии</Title>
          <Button leftSection={<IconPlus size={18} />} onClick={handleCreate}>
            Создать вакансию
          </Button>
        </Group>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md">
            <TextInput
              placeholder="Поиск вакансий..."
              leftSection={<IconSearch size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Статус"
              data={[
                { value: "all", label: "Все" },
                { value: "pending", label: "На модерации" },
                { value: "active", label: "Активные" },
                { value: "paused", label: "На паузе" },
                { value: "closed", label: "Закрытые" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              w={200}
            />
          </Group>

          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Название</Table.Th>
                <Table.Th>Отдел</Table.Th>
                <Table.Th>Локация</Table.Th>
                <Table.Th>Зарплата</Table.Th>
                <Table.Th>Кандидаты</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredVacancies.map((vacancy) => (
                <Table.Tr key={vacancy.id}>
                  <Table.Td>
                    <Text fw={500}>{vacancy.title}</Text>
                  </Table.Td>
                  <Table.Td>{vacancy.department}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconMapPin size={16} />
                      {vacancy.location}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconCurrencyRubel size={16} />
                      {vacancy.salary}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconUsers size={16} />}
                      onClick={() => handleViewResponses(vacancy.id)}
                    >
                      {vacancy.candidates}
                    </Button>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(vacancy.status)}
                      variant="light"
                    >
                      {getStatusLabel(vacancy.status)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleView(vacancy)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="orange"
                        onClick={() => handleEdit(vacancy)}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(vacancy.id)}
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
        title={editMode ? "Редактировать вакансию" : "Создать вакансию"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Название вакансии"
              placeholder="Frontend Developer"
              required
              {...form.getInputProps("title")}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Отдел"
                  placeholder="IT"
                  required
                  {...form.getInputProps("department")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Локация"
                  placeholder="Москва"
                  required
                  {...form.getInputProps("location")}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Тип занятости"
                  placeholder="Выберите тип"
                  required
                  data={[
                    "Полная занятость",
                    "Частичная занятость",
                    "Стажировка",
                    "Удаленная работа",
                  ]}
                  {...form.getInputProps("employmentType")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Зарплата"
                  placeholder="100 000 - 150 000 ₽"
                  required
                  {...form.getInputProps("salary")}
                />
              </Grid.Col>
            </Grid>
            <Textarea
              label="Описание"
              placeholder="Опишите вакансию..."
              required
              minRows={3}
              {...form.getInputProps("description")}
            />
            <Textarea
              label="Требования"
              placeholder="Требования к кандидату..."
              required
              minRows={3}
              {...form.getInputProps("requirements")}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Email для откликов"
                  placeholder="hr@company.ru"
                  type="email"
                  required
                  {...form.getInputProps("contactEmail")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Телефон для связи"
                  placeholder="+7 (999) 123-45-67"
                  required
                  {...form.getInputProps("contactPhone")}
                />
              </Grid.Col>
            </Grid>
            <DateTimePicker
              label="Дата и время автоснятия с публикации (опционально)"
              placeholder="Выберите дату и время"
              description="Вакансия автоматически снимется с публикации в указанное время"
              {...form.getInputProps("autoUnpublishDate")}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>
                Отмена
              </Button>
              <Button type="submit">
                {editMode ? "Сохранить" : "Создать"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Модальное окно просмотра */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title="Детали вакансии"
        size="lg"
      >
        {selectedVacancy && (
          <Stack>
            <div>
              <Text size="sm" c="dimmed">
                Название
              </Text>
              <Text size="lg" fw={500}>
                {selectedVacancy.title}
              </Text>
            </div>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Отдел
                </Text>
                <Text>{selectedVacancy.department}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Локация
                </Text>
                <Text>{selectedVacancy.location}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Тип занятости
                </Text>
                <Text>{selectedVacancy.employmentType}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Зарплата
                </Text>
                <Text>{selectedVacancy.salary}</Text>
              </Grid.Col>
            </Grid>
            <div>
              <Text size="sm" c="dimmed">
                Кандидатов
              </Text>
              <Text>{selectedVacancy.candidates}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Статус
              </Text>
              <Badge
                color={getStatusColor(selectedVacancy.status)}
                variant="light"
              >
                {getStatusLabel(selectedVacancy.status)}
              </Badge>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Описание
              </Text>
              <Text>{selectedVacancy.description}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Требования
              </Text>
              <Text>{selectedVacancy.requirements}</Text>
            </div>
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}
