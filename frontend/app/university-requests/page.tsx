"use client";

import { useState } from "react";
import {
  Stack,
  Title,
  Paper,
  Group,
  Text,
  Button,
  Card,
  Badge,
  SimpleGrid,
  Modal,
  TextInput,
  Textarea,
  Grid,
  Table,
  ActionIcon,
  ThemeIcon,
} from "@mantine/core";
import {
  IconPlus,
  IconSchool,
  IconUsers,
  IconEye,
  IconEdit,
  IconTrash,
  IconBriefcase,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";

const mockRequests = [
  {
    id: 1,
    specialty: "Разработка программного обеспечения",
    studentsCount: 5,
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    description: "Стажировка для студентов 3-4 курсов направления ПО",
    requirements: "Знание JavaScript, опыт с React приветствуется",
    responsesCount: 3,
    createdAt: "2025-10-15",
  },
  {
    id: 2,
    specialty: "Аналитика данных",
    studentsCount: 3,
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    description: "Практика по анализу данных для магистрантов",
    requirements: "Python, SQL, базовые знания ML",
    responsesCount: 5,
    createdAt: "2025-10-14",
  },
];

export default function UniversityRequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    initialValues: {
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      specialty: "",
      studentsCount: 0,
      startDate: null as Date | null,
      endDate: null as Date | null,
      description: "",
      requirements: "",
    },
  });

  const handleCreate = () => {
    setEditMode(false);
    form.reset();
    open();
  };

  const handleEdit = (request: any) => {
    setEditMode(true);
    setSelectedRequest(request);
    form.setValues({
      contactName: "Иван Петров",
      contactEmail: "petrov@university.ru",
      contactPhone: "+7 (999) 111-22-33",
      specialty: request.specialty,
      studentsCount: request.studentsCount,
      startDate: new Date(request.startDate),
      endDate: new Date(request.endDate),
      description: request.description,
      requirements: request.requirements,
    });
    open();
  };

  const handleView = (request: any) => {
    setSelectedRequest(request);
    openView();
  };

  const handleDelete = (id: number) => {
    setRequests(requests.filter((r) => r.id !== id));
    notifications.show({
      title: "Успешно",
      message: "Заявка удалена",
      color: "green",
    });
  };

  const handleSubmit = (values: typeof form.values) => {
    if (editMode) {
      setRequests(
        requests.map((r) =>
          r.id === selectedRequest.id
            ? {
                ...r,
                specialty: values.specialty,
                studentsCount: values.studentsCount,
                startDate: values.startDate?.toISOString().split("T")[0] || "",
                endDate: values.endDate?.toISOString().split("T")[0] || "",
                description: values.description,
                requirements: values.requirements,
              }
            : r
        )
      );
      notifications.show({
        title: "Успешно",
        message: "Заявка обновлена",
        color: "green",
      });
    } else {
      const newRequest = {
        id: Math.max(...requests.map((r) => r.id)) + 1,
        specialty: values.specialty,
        studentsCount: values.studentsCount,
        startDate: values.startDate?.toISOString().split("T")[0] || "",
        endDate: values.endDate?.toISOString().split("T")[0] || "",
        description: values.description,
        requirements: values.requirements,
        responsesCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRequests([...requests, newRequest]);
      notifications.show({
        title: "Успешно",
        message: "Заявка на стажировку создана и опубликована",
        color: "green",
      });
    }
    close();
  };

  const stats = {
    total: requests.length,
    totalResponses: requests.reduce((sum, r) => sum + r.responsesCount, 0),
    totalStudents: requests.reduce((sum, r) => sum + r.studentsCount, 0),
  };

  return (
    <Stack gap="lg" p="md">
      <Group justify="space-between">
        <div>
          <Title order={1}>Заявки на стажировку</Title>
          <Text c="dimmed" mt="xs">
            Управление заявками от университета
          </Text>
        </div>
        <Button leftSection={<IconPlus size={18} />} onClick={handleCreate}>
          Создать заявку
        </Button>
      </Group>

      {/* Статистика */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card padding="md" radius="md" withBorder>
          <Group>
            <ThemeIcon size="xl" radius="md" color="red" variant="light">
              <IconSchool size={24} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Активных заявок
              </Text>
              <Text size="xl" fw={700}>
                {stats.total}
              </Text>
            </div>
          </Group>
        </Card>
        <Card padding="md" radius="md" withBorder>
          <Group>
            <ThemeIcon size="xl" radius="md" color="teal" variant="light">
              <IconBriefcase size={24} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Откликов компаний
              </Text>
              <Text size="xl" fw={700}>
                {stats.totalResponses}
              </Text>
            </div>
          </Group>
        </Card>
        <Card padding="md" radius="md" withBorder>
          <Group>
            <ThemeIcon size="xl" radius="md" color="violet" variant="light">
              <IconUsers size={24} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Студентов
              </Text>
              <Text size="xl" fw={700}>
                {stats.totalStudents}
              </Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Список заявок */}
      <Paper p="md" radius="md" withBorder>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Специальность</Table.Th>
              <Table.Th>Студентов</Table.Th>
              <Table.Th>Период</Table.Th>
              <Table.Th>Откликов</Table.Th>
              <Table.Th>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((request) => (
              <Table.Tr key={request.id}>
                <Table.Td>
                  <Text fw={500}>{request.specialty}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light">{request.studentsCount}</Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {new Date(request.startDate).toLocaleDateString("ru")} -{" "}
                    {new Date(request.endDate).toLocaleDateString("ru")}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge color="teal" variant="light">
                    {request.responsesCount}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => handleView(request)}
                    >
                      <IconEye size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="orange"
                      onClick={() => handleEdit(request)}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => handleDelete(request.id)}
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

      {/* Модальное окно создания/редактирования */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          editMode ? "Редактировать заявку" : "Создать заявку на стажировку"
        }
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Контактное лицо"
              placeholder="Иван Петров"
              required
              {...form.getInputProps("contactName")}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  placeholder="petrov@university.ru"
                  type="email"
                  required
                  {...form.getInputProps("contactEmail")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Телефон"
                  placeholder="+7 (999) 111-22-33"
                  required
                  {...form.getInputProps("contactPhone")}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Специальность"
              placeholder="Разработка программного обеспечения"
              required
              {...form.getInputProps("specialty")}
            />
            <Grid>
              <Grid.Col span={4}>
                <TextInput
                  label="Количество студентов"
                  placeholder="5"
                  type="number"
                  required
                  {...form.getInputProps("studentsCount")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <DatePickerInput
                  label="Дата начала"
                  placeholder="Выберите дату"
                  required
                  {...form.getInputProps("startDate")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <DatePickerInput
                  label="Дата окончания"
                  placeholder="Выберите дату"
                  required
                  {...form.getInputProps("endDate")}
                />
              </Grid.Col>
            </Grid>
            <Textarea
              label="Описание"
              placeholder="Опишите программу стажировки..."
              minRows={3}
              required
              {...form.getInputProps("description")}
            />
            <Textarea
              label="Требования к компаниям"
              placeholder="Укажите требования и пожелания..."
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
        title="Детали заявки"
        size="lg"
      >
        {selectedRequest && (
          <Stack>
            <div>
              <Text size="sm" c="dimmed">
                Специальность
              </Text>
              <Text size="lg" fw={500}>
                {selectedRequest.specialty}
              </Text>
            </div>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Количество студентов
                </Text>
                <Text>{selectedRequest.studentsCount}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Откликов от компаний
                </Text>
                <Badge color="teal" size="lg">
                  {selectedRequest.responsesCount}
                </Badge>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Дата начала
                </Text>
                <Text>
                  {new Date(selectedRequest.startDate).toLocaleDateString("ru")}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Дата окончания
                </Text>
                <Text>
                  {new Date(selectedRequest.endDate).toLocaleDateString("ru")}
                </Text>
              </Grid.Col>
            </Grid>
            <div>
              <Text size="sm" c="dimmed">
                Описание
              </Text>
              <Text>{selectedRequest.description}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Требования
              </Text>
              <Text>{selectedRequest.requirements}</Text>
            </div>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
