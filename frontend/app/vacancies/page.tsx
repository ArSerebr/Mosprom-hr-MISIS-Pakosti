"use client";

import { AppShell } from "@/components/AppShell/AppShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
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
  NumberInput,
  Grid,
  Loader,
  Center,
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
import { 
  getMyVacancies, 
  createVacancy, 
  updateVacancy, 
  deleteVacancy,
  Vacancy 
} from "@/lib/api";

export default function VacanciesPage() {
  return (
    <ProtectedRoute>
      <VacanciesContent />
    </ProtectedRoute>
  );
}

function VacanciesContent() {
  const { token } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [opened, { open, close }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [editMode, setEditMode] = useState(false);

  const router = useRouter();

  // Загрузка вакансий при монтировании компонента
  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error("Токен авторизации не найден");
      }
      const data = await getMyVacancies(token);
      setVacancies(data);
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось загрузить вакансии",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const form = useForm({
    initialValues: {
      vacancy_title: "",
      company_name: "",
      platform: "",
      specialty: "",
      responsibilities: "",
      requirements: "",
      employment_type: "",
      schedule: "",
      location: "",
      salary: "",
      extra_info: "",
      company_website: "",
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
      vacancy_title: vacancy.vacancy_title,
      company_name: vacancy.company_name,
      platform: vacancy.platform,
      specialty: vacancy.specialty,
      responsibilities: vacancy.responsibilities.join('\n'),
      requirements: vacancy.requirements.join('\n'),
      employment_type: vacancy.employment_type || "",
      schedule: vacancy.schedule || "",
      location: vacancy.location || "",
      salary: vacancy.salary || "",
      extra_info: vacancy.extra_info || "",
      company_website: vacancy.company_website || "",
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

  const handleDelete = async (id: number) => {
    try {
      await deleteVacancy(id);
      setVacancies(vacancies.filter((v) => v.id !== id));
      notifications.show({
        title: "Успешно",
        message: "Вакансия удалена",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось удалить вакансию",
        color: "red",
      });
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Преобразуем строки в массивы для responsibilities и requirements
      const processedValues = {
        ...values,
        responsibilities: typeof values.responsibilities === 'string' 
          ? values.responsibilities.split('\n').filter(line => line.trim())
          : values.responsibilities,
        requirements: typeof values.requirements === 'string'
          ? values.requirements.split('\n').filter(line => line.trim())
          : values.requirements,
      };

      if (editMode && selectedVacancy) {
        const updated = await updateVacancy(selectedVacancy.id, processedValues);
        setVacancies(vacancies.map((v) => v.id === selectedVacancy.id ? updated : v));
        notifications.show({
          title: "Успешно",
          message: "Вакансия обновлена",
          color: "green",
        });
      } else {
        const newVacancy = await createVacancy({
          ...processedValues,
          status: "pending"
        });
        setVacancies([...vacancies, newVacancy]);
        notifications.show({
          title: "Успешно",
          message: "Вакансия отправлена на модерацию",
          color: "green",
        });
      }
      close();
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось сохранить вакансию",
        color: "red",
      });
    }
  };

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.vacancy_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vacancy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      pending: "На модерации",
      approve: "Одобрена",
      rejected: "Отклонена",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <AppShell>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" />
            <Text>Загрузка вакансий...</Text>
          </Stack>
        </Center>
      </AppShell>
    );
  }

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
                { value: "approve", label: "Одобренные" },
                { value: "rejected", label: "Отклоненные" },
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
                <Table.Th>Компания</Table.Th>
                <Table.Th>Специальность</Table.Th>
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
                    <Text fw={500}>{vacancy.vacancy_title}</Text>
                  </Table.Td>
                  <Table.Td>{vacancy.company_name}</Table.Td>
                  <Table.Td>{vacancy.specialty}</Table.Td>
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
                      {vacancy.applications?.length || 0}
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
              {...form.getInputProps("vacancy_title")}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Название компании"
                  placeholder="Tech Company Inc."
                  required
                  {...form.getInputProps("company_name")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Платформа"
                  placeholder="hh.ru"
                  required
                  {...form.getInputProps("platform")}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Специальность"
              placeholder="Frontend Development"
              required
              {...form.getInputProps("specialty")}
            />
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Тип занятости"
                  placeholder="Выберите тип"
                  data={[
                    "Полная занятость",
                    "Частичная занятость",
                    "Стажировка",
                    "Удаленная работа",
                  ]}
                  {...form.getInputProps("employment_type")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="График работы"
                  placeholder="Полный день"
                  {...form.getInputProps("schedule")}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Локация"
                  placeholder="Москва"
                  {...form.getInputProps("location")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Зарплата"
                  placeholder="100 000 - 150 000 ₽"
                  {...form.getInputProps("salary")}
                />
              </Grid.Col>
            </Grid>
            <Textarea
              label="Обязанности (по одному на строку)"
              placeholder="Разработка веб-приложений&#10;Оптимизация производительности&#10;Работа в команде"
              minRows={3}
              value={Array.isArray(form.values.responsibilities) 
                ? form.values.responsibilities.join('\n') 
                : form.values.responsibilities}
              onChange={(e) => form.setFieldValue('responsibilities', e.currentTarget.value)}
            />
            <Textarea
              label="Требования (по одному на строку)"
              placeholder="React, TypeScript&#10;5+ лет опыта&#10;Знание современных инструментов"
              minRows={3}
              value={Array.isArray(form.values.requirements) 
                ? form.values.requirements.join('\n') 
                : form.values.requirements}
              onChange={(e) => form.setFieldValue('requirements', e.currentTarget.value)}
            />
            <Textarea
              label="Дополнительная информация"
              placeholder="Дополнительная информация о вакансии..."
              minRows={2}
              {...form.getInputProps("extra_info")}
            />
            <TextInput
              label="Сайт компании"
              placeholder="https://company.com"
              {...form.getInputProps("company_website")}
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
                {selectedVacancy.vacancy_title}
              </Text>
            </div>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Компания
                </Text>
                <Text>{selectedVacancy.company_name}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Платформа
                </Text>
                <Text>{selectedVacancy.platform}</Text>
              </Grid.Col>
            </Grid>
            <div>
              <Text size="sm" c="dimmed">
                Специальность
              </Text>
              <Text>{selectedVacancy.specialty}</Text>
            </div>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Тип занятости
                </Text>
                <Text>{selectedVacancy.employment_type}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  График работы
                </Text>
                <Text>{selectedVacancy.schedule}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Локация
                </Text>
                <Text>{selectedVacancy.location}</Text>
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
              <Text>{selectedVacancy.applications?.length || 0}</Text>
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
                Обязанности
              </Text>
              <ul>
                {selectedVacancy.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Требования
              </Text>
              <ul>
                {selectedVacancy.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            {selectedVacancy.extra_info && (
              <div>
                <Text size="sm" c="dimmed">
                  Дополнительная информация
                </Text>
                <Text>{selectedVacancy.extra_info}</Text>
              </div>
            )}
            {selectedVacancy.company_website && (
              <div>
                <Text size="sm" c="dimmed">
                  Сайт компании
                </Text>
                <Text>
                  <a href={selectedVacancy.company_website} target="_blank" rel="noopener noreferrer">
                    {selectedVacancy.company_website}
                  </a>
                </Text>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </AppShell>
  );
}
