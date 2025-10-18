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
  Card,
  SimpleGrid,
  ThemeIcon,
  Progress,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconCalendar,
  IconSchool,
  IconClock,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { DatePickerInput } from "@mantine/dates";

interface Internship {
  id: number;
  title: string;
  department: string;
  duration: string;
  startDate: string;
  endDate: string;
  spots: number;
  applicants: number;
  status: "open" | "in-progress" | "completed";
  description: string;
  requirements: string;
}

const mockInternships: Internship[] = [
  {
    id: 1,
    title: "Frontend Development Internship",
    department: "IT",
    duration: "3 месяца",
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    spots: 5,
    applicants: 42,
    status: "open",
    description: "Стажировка по frontend разработке",
    requirements: "Знание JavaScript, React",
  },
  {
    id: 2,
    title: "Product Management Internship",
    department: "Продукт",
    duration: "6 месяцев",
    startDate: "2025-10-15",
    endDate: "2026-04-15",
    spots: 3,
    applicants: 28,
    status: "in-progress",
    description: "Стажировка в продуктовой команде",
    requirements: "Аналитическое мышление, коммуникация",
  },
  {
    id: 3,
    title: "UX Design Internship",
    department: "Дизайн",
    duration: "4 месяца",
    startDate: "2025-11-15",
    endDate: "2026-03-15",
    spots: 4,
    applicants: 35,
    status: "open",
    description: "Стажировка по UX дизайну",
    requirements: "Figma, базовые знания UX",
  },
  {
    id: 4,
    title: "Data Analytics Internship",
    department: "Аналитика",
    duration: "3 месяца",
    startDate: "2025-09-01",
    endDate: "2025-11-30",
    spots: 2,
    applicants: 19,
    status: "completed",
    description: "Стажировка по анализу данных",
    requirements: "Python, SQL, Excel",
  },
  {
    id: 5,
    title: "Backend Development Internship",
    department: "IT",
    duration: "4 месяца",
    startDate: "2025-12-01",
    endDate: "2026-03-31",
    spots: 3,
    applicants: 31,
    status: "open",
    description: "Стажировка по backend разработке",
    requirements: "Python или Java, базы данных",
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    open: "green",
    "in-progress": "blue",
    completed: "gray",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Открыта",
    "in-progress": "В процессе",
    completed: "Завершена",
  };
  return labels[status] || status;
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [opened, { open, close }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      department: "",
      duration: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      spots: 0,
      description: "",
      requirements: "",
    },
  });

  const handleCreate = () => {
    setEditMode(false);
    form.reset();
    open();
  };

  const handleEdit = (internship: Internship) => {
    setEditMode(true);
    setSelectedInternship(internship);
    form.setValues({
      title: internship.title,
      department: internship.department,
      duration: internship.duration,
      startDate: new Date(internship.startDate),
      endDate: new Date(internship.endDate),
      spots: internship.spots,
      description: internship.description,
      requirements: internship.requirements,
    });
    open();
  };

  const handleView = (internship: Internship) => {
    setSelectedInternship(internship);
    openView();
  };

  const handleDelete = (id: number) => {
    setInternships(internships.filter((i) => i.id !== id));
    notifications.show({
      title: "Успешно",
      message: "Стажировка удалена",
      color: "green",
    });
  };

  const handleSubmit = (values: typeof form.values) => {
    if (editMode && selectedInternship) {
      setInternships(
        internships.map((i) =>
          i.id === selectedInternship.id
            ? {
                ...i,
                ...values,
                startDate: values.startDate?.toISOString().split("T")[0] || "",
                endDate: values.endDate?.toISOString().split("T")[0] || "",
              }
            : i
        )
      );
      notifications.show({
        title: "Успешно",
        message: "Стажировка обновлена",
        color: "green",
      });
    } else {
      const newInternship: Internship = {
        id: Math.max(...internships.map((i) => i.id)) + 1,
        title: values.title,
        department: values.department,
        duration: values.duration,
        startDate: values.startDate?.toISOString().split("T")[0] || "",
        endDate: values.endDate?.toISOString().split("T")[0] || "",
        spots: values.spots,
        applicants: 0,
        status: "open",
        description: values.description,
        requirements: values.requirements,
      };
      setInternships([...internships, newInternship]);
      notifications.show({
        title: "Успешно",
        message: "Стажировка создана",
        color: "green",
      });
    }
    close();
  };

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || internship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: internships.length,
    open: internships.filter((i) => i.status === "open").length,
    inProgress: internships.filter((i) => i.status === "in-progress").length,
    completed: internships.filter((i) => i.status === "completed").length,
  };

  return (
    <AppShell>
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Стажировки</Title>
          <Button leftSection={<IconPlus size={18} />} onClick={handleCreate}>
            Создать стажировку
          </Button>
        </Group>

        {/* Статистика */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="blue" variant="light">
                <IconSchool size={24} />
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
                <IconClock size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Открыты
                </Text>
                <Text size="xl" fw={700}>
                  {stats.open}
                </Text>
              </div>
            </Group>
          </Card>
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="blue" variant="light">
                <IconUsers size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  В процессе
                </Text>
                <Text size="xl" fw={700}>
                  {stats.inProgress}
                </Text>
              </div>
            </Group>
          </Card>
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="gray" variant="light">
                <IconSchool size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Завершены
                </Text>
                <Text size="xl" fw={700}>
                  {stats.completed}
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md">
            <TextInput
              placeholder="Поиск стажировок..."
              leftSection={<IconSearch size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Статус"
              data={[
                { value: "all", label: "Все" },
                { value: "open", label: "Открыты" },
                { value: "in-progress", label: "В процессе" },
                { value: "completed", label: "Завершены" },
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
                <Table.Th>Длительность</Table.Th>
                <Table.Th>Даты</Table.Th>
                <Table.Th>Заявки</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Действия</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredInternships.map((internship) => (
                <Table.Tr key={internship.id}>
                  <Table.Td>
                    <Text fw={500}>{internship.title}</Text>
                  </Table.Td>
                  <Table.Td>{internship.department}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconClock size={16} />
                      {internship.duration}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text size="sm">
                        {new Date(internship.startDate).toLocaleDateString(
                          "ru"
                        )}{" "}
                        -{" "}
                        {new Date(internship.endDate).toLocaleDateString("ru")}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>
                        {internship.applicants} / {internship.spots}
                      </Text>
                      <Progress
                        value={(internship.applicants / internship.spots) * 100}
                        size="xs"
                        mt={4}
                      />
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(internship.status)}
                      variant="light"
                    >
                      {getStatusLabel(internship.status)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleView(internship)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="orange"
                        onClick={() => handleEdit(internship)}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(internship.id)}
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
        title={editMode ? "Редактировать стажировку" : "Создать стажировку"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Название стажировки"
              placeholder="Frontend Development Internship"
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
                  label="Длительность"
                  placeholder="3 месяца"
                  required
                  {...form.getInputProps("duration")}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Дата начала"
                  placeholder="Выберите дату"
                  required
                  {...form.getInputProps("startDate")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Дата окончания"
                  placeholder="Выберите дату"
                  required
                  {...form.getInputProps("endDate")}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Количество мест"
              placeholder="5"
              type="number"
              required
              {...form.getInputProps("spots")}
            />
            <Textarea
              label="Описание"
              placeholder="Опишите стажировку..."
              required
              minRows={3}
              {...form.getInputProps("description")}
            />
            <Textarea
              label="Требования"
              placeholder="Требования к кандидатам..."
              required
              minRows={3}
              {...form.getInputProps("requirements")}
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
        title="Детали стажировки"
        size="lg"
      >
        {selectedInternship && (
          <Stack>
            <div>
              <Text size="sm" c="dimmed">
                Название
              </Text>
              <Text size="lg" fw={500}>
                {selectedInternship.title}
              </Text>
            </div>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Отдел
                </Text>
                <Text>{selectedInternship.department}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Длительность
                </Text>
                <Text>{selectedInternship.duration}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Дата начала
                </Text>
                <Text>
                  {new Date(selectedInternship.startDate).toLocaleDateString(
                    "ru"
                  )}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Дата окончания
                </Text>
                <Text>
                  {new Date(selectedInternship.endDate).toLocaleDateString(
                    "ru"
                  )}
                </Text>
              </Grid.Col>
            </Grid>
            <div>
              <Text size="sm" c="dimmed">
                Заявки / Места
              </Text>
              <Text>
                {selectedInternship.applicants} / {selectedInternship.spots}
              </Text>
              <Progress
                value={
                  (selectedInternship.applicants / selectedInternship.spots) *
                  100
                }
                size="lg"
                mt={4}
              />
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Статус
              </Text>
              <Badge
                color={getStatusColor(selectedInternship.status)}
                variant="light"
              >
                {getStatusLabel(selectedInternship.status)}
              </Badge>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Описание
              </Text>
              <Text>{selectedInternship.description}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Требования
              </Text>
              <Text>{selectedInternship.requirements}</Text>
            </div>
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}
