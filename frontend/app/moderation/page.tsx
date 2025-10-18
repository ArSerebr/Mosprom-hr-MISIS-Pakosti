"use client";

import { AppShell } from "@/components/AppShell/AppShell";
import { useState } from "react";
import {
  Title,
  Stack,
  Paper,
  Group,
  Text,
  Badge,
  Button,
  Modal,
  Textarea,
  Card,
  SimpleGrid,
  ThemeIcon,
  Box,
  ScrollArea,
  ActionIcon,
  Divider,
  Select,
} from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
  IconEye,
  IconMapPin,
  IconCurrencyRubel,
  IconBuilding,
  IconFilter,
  IconFilterOff,
  IconUser,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { DatePickerInput } from "@mantine/dates";

type VacancyStatus = "pending" | "approved" | "rejected";

interface Vacancy {
  id: number;
  title: string;
  company: string;
  department: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  hrName: string;
  status: VacancyStatus;
  moderatorComment?: string;
}

const mockVacancies: Vacancy[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "ТехКомпания",
    department: "IT",
    location: "Москва",
    salary: "200 000 - 300 000 ₽",
    description: "Разработка современных веб-приложений на React и TypeScript",
    requirements: "React, TypeScript, 5+ лет опыта",
    contactEmail: "hr@techcompany.ru",
    contactPhone: "+7 (999) 123-45-67",
    createdAt: "2025-10-17 10:30",
    hrName: "Анна Иванова",
    status: "pending",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Стартап АБВ",
    department: "Продукт",
    location: "Москва",
    salary: "250 000 - 350 000 ₽",
    description: "Управление продуктовой командой",
    requirements: "Опыт в продуктовом менеджменте 3+ года",
    contactEmail: "jobs@startupabv.ru",
    contactPhone: "+7 (999) 234-56-78",
    createdAt: "2025-10-17 11:15",
    hrName: "Петр Сидоров",
    status: "pending",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Дизайн Студия",
    department: "Дизайн",
    location: "Удаленно",
    salary: "150 000 - 220 000 ₽",
    description: "Проектирование пользовательских интерфейсов",
    requirements: "Figma, опыт 2+ года",
    contactEmail: "hr@designstudio.ru",
    contactPhone: "+7 (999) 345-67-89",
    createdAt: "2025-10-17 09:00",
    hrName: "Елена Волкова",
    status: "pending",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "ТехКомпания",
    department: "IT",
    location: "Москва",
    salary: "180 000 - 280 000 ₽",
    description: "Разработка серверной части приложений",
    requirements: "Python/FastAPI, PostgreSQL",
    contactEmail: "hr@techcompany.ru",
    contactPhone: "+7 (999) 123-45-67",
    createdAt: "2025-10-16 14:20",
    hrName: "Анна Иванова",
    status: "approved",
    moderatorComment: "Вакансия соответствует требованиям",
  },
  {
    id: 5,
    title: "Junior Developer",
    company: "Стартап XYZ",
    department: "IT",
    location: "Москва",
    salary: "Не указана",
    description: "Разработка",
    requirements: "Нет требований",
    contactEmail: "info@xyz.ru",
    contactPhone: "+7 (999) 111-11-11",
    createdAt: "2025-10-16 16:45",
    hrName: "Иван Петров",
    status: "rejected",
    moderatorComment: "Недостаточно информации о вакансии",
  },
  {
    id: 6,
    title: "Senior Frontend Developer",
    company: "ТехКомпания",
    department: "IT",
    location: "Москва",
    salary: "200 000 - 300 000 ₽",
    description: "Разработка современных веб-приложений на React и TypeScript",
    requirements: "React, TypeScript, 5+ лет опыта",
    contactEmail: "hr@techcompany.ru",
    contactPhone: "+7 (999) 123-45-67",
    createdAt: "2025-10-17 10:30",
    hrName: "Анна Иванова",
    status: "pending",
  },
  {
    id: 7,
    title: "Product Manager",
    company: "Стартап АБВ",
    department: "Продукт",
    location: "Москва",
    salary: "250 000 - 350 000 ₽",
    description: "Управление продуктовой командой",
    requirements: "Опыт в продуктовом менеджменте 3+ года",
    contactEmail: "jobs@startupabv.ru",
    contactPhone: "+7 (999) 234-56-78",
    createdAt: "2025-10-17 11:15",
    hrName: "Петр Сидоров",
    status: "pending",
  },
  {
    id: 8,
    title: "UX/UI Designer",
    company: "Дизайн Студия",
    department: "Дизайн",
    location: "Удаленно",
    salary: "150 000 - 220 000 ₽",
    description: "Проектирование пользовательских интерфейсов",
    requirements: "Figma, опыт 2+ года",
    contactEmail: "hr@designstudio.ru",
    contactPhone: "+7 (999) 345-67-89",
    createdAt: "2025-10-17 09:00",
    hrName: "Елена Волкова",
    status: "pending",
  },
  {
    id: 9,
    title: "Backend Developer",
    company: "ТехКомпания",
    department: "IT",
    location: "Москва",
    salary: "180 000 - 280 000 ₽",
    description: "Разработка серверной части приложений",
    requirements: "Python/FastAPI, PostgreSQL",
    contactEmail: "hr@techcompany.ru",
    contactPhone: "+7 (999) 123-45-67",
    createdAt: "2025-10-16 14:20",
    hrName: "Анна Иванова",
    status: "approved",
    moderatorComment: "Вакансия соответствует требованиям",
  },
  {
    id: 10,
    title: "Junior Developer",
    company: "Стартап XYZ",
    department: "IT",
    location: "Москва",
    salary: "Не указана",
    description: "Разработка",
    requirements: "Нет требований",
    contactEmail: "info@xyz.ru",
    contactPhone: "+7 (999) 111-11-11",
    createdAt: "2025-10-16 16:45",
    hrName: "Иван Петров",
    status: "rejected",
    moderatorComment: "Недостаточно информации о вакансии",
  },
];

const columns = [
  { id: "pending" as VacancyStatus, title: "На модерации", color: "orange" },
  { id: "approved" as VacancyStatus, title: "Одобрено", color: "green" },
  { id: "rejected" as VacancyStatus, title: "Отклонено", color: "red" },
];

export default function ModerationPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(mockVacancies);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [actionOpened, { open: openAction, close: closeAction }] =
    useDisclosure(false);
  const [action, setAction] = useState<"approve" | "reject">("approve");

  // Фильтры
  const [cityFilter, setCityFilter] = useState<string | null>("all");
  const [companyFilter, setCompanyFilter] = useState<string | null>("all");
  const [salaryFilter, setSalaryFilter] = useState<string | null>("all");
  const [hrFilter, setHrFilter] = useState<string | null>("all");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Состояние сворачивания колонок для мобильных
  const [collapsedColumns, setCollapsedColumns] = useState<{
    [key in VacancyStatus]: boolean;
  }>({
    pending: false,
    approved: false,
    rejected: false,
  });

  const toggleColumn = (columnId: VacancyStatus) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const form = useForm({
    initialValues: {
      comment: "",
    },
  });

  // Получение уникальных значений для фильтров
  const uniqueCities = [
    "all",
    ...new Set(mockVacancies.map((v) => v.location)),
  ];
  const uniqueCompanies = [
    "all",
    ...new Set(mockVacancies.map((v) => v.company)),
  ];
  const uniqueHRs = ["all", ...new Set(mockVacancies.map((v) => v.hrName))];

  const salaryRanges = [
    { value: "all", label: "Любая" },
    { value: "0-100000", label: "До 100 000 ₽" },
    { value: "100000-200000", label: "100 000 - 200 000 ₽" },
    { value: "200000-300000", label: "200 000 - 300 000 ₽" },
    { value: "300000+", label: "300 000+ ₽" },
  ];

  // Функция проверки зарплаты
  const checkSalary = (salaryString: string, range: string) => {
    if (range === "all") return true;

    // Извлекаем числа из строки зарплаты
    const numbers = salaryString.match(/\d+/g);
    if (!numbers || numbers.length === 0) return range === "all";

    const minSalary = parseInt(numbers[0]) * 1000; // предполагаем формат "200 000"

    if (range === "0-100000") return minSalary < 100000;
    if (range === "100000-200000")
      return minSalary >= 100000 && minSalary < 200000;
    if (range === "200000-300000")
      return minSalary >= 200000 && minSalary < 300000;
    if (range === "300000+") return minSalary >= 300000;

    return true;
  };

  // Функция проверки даты
  const checkDateRange = (createdAt: string) => {
    if (!dateFrom && !dateTo) return true;

    const vacancyDate = new Date(createdAt);

    if (dateFrom && vacancyDate < dateFrom) return false;
    if (dateTo && vacancyDate > dateTo) return false;

    return true;
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setCityFilter("all");
    setCompanyFilter("all");
    setSalaryFilter("all");
    setHrFilter("all");
    setDateFrom(null);
    setDateTo(null);
  };

  // Проверка, активны ли фильтры
  const hasActiveFilters =
    cityFilter !== "all" ||
    companyFilter !== "all" ||
    salaryFilter !== "all" ||
    hrFilter !== "all" ||
    dateFrom !== null ||
    dateTo !== null;

  const handleViewDetails = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    openDetails();
  };

  const handleMoveToColumn = (
    vacancy: Vacancy,
    newStatus: VacancyStatus,
    comment?: string
  ) => {
    setVacancies(
      vacancies.map((v) =>
        v.id === vacancy.id
          ? { ...v, status: newStatus, moderatorComment: comment }
          : v
      )
    );

    const statusLabels = {
      approved: "одобрена",
      rejected: "отклонена",
      pending: "возвращена на модерацию",
    };

    notifications.show({
      title: "Успешно",
      message: `Вакансия ${statusLabels[newStatus]}`,
      color:
        newStatus === "approved"
          ? "green"
          : newStatus === "rejected"
          ? "red"
          : "orange",
    });
  };

  const handleQuickApprove = (vacancy: Vacancy) => {
    handleMoveToColumn(vacancy, "approved", "Одобрено");
  };

  const handleOpenReject = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setAction("reject");
    form.reset();
    openAction();
  };

  const handleOpenApprove = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setAction("approve");
    form.reset();
    openAction();
  };

  const handleSubmit = (values: typeof form.values) => {
    if (selectedVacancy) {
      handleMoveToColumn(
        selectedVacancy,
        action === "approve" ? "approved" : "rejected",
        values.comment
      );
    }
    closeAction();
  };

  const getVacanciesByStatus = (status: VacancyStatus) => {
    return vacancies.filter((v) => {
      // Фильтр по статусу
      if (v.status !== status) return false;

      // Фильтр по городу
      if (cityFilter !== "all" && v.location !== cityFilter) return false;

      // Фильтр по компании
      if (companyFilter !== "all" && v.company !== companyFilter) return false;

      // Фильтр по зарплате
      if (!checkSalary(v.salary, salaryFilter || "all")) return false;

      // Фильтр по HR
      if (hrFilter !== "all" && v.hrName !== hrFilter) return false;

      // Фильтр по дате
      if (!checkDateRange(v.createdAt)) return false;

      return true;
    });
  };

  const stats = {
    pending: vacancies.filter((v) => v.status === "pending").length,
    approved: vacancies.filter((v) => v.status === "approved").length,
    rejected: vacancies.filter((v) => v.status === "rejected").length,
  };

  // Статистика с учетом фильтров
  const filteredStats = {
    pending: getVacanciesByStatus("pending").length,
    approved: getVacanciesByStatus("approved").length,
    rejected: getVacanciesByStatus("rejected").length,
  };

  return (
    <AppShell>
      <Stack gap="lg">
        <Title order={1}>Модерация вакансий</Title>

        {/* Панель фильтров */}
        <Paper p="md" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <IconFilter size={20} />
                <Text fw={600}>Фильтры</Text>
                {hasActiveFilters && (
                  <Badge color="red" variant="light">
                    Активно
                  </Badge>
                )}
              </Group>
              {hasActiveFilters && (
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconFilterOff size={16} />}
                  onClick={resetFilters}
                >
                  Сбросить фильтры
                </Button>
              )}
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="md">
              <Select
                label="Город"
                placeholder="Все города"
                data={uniqueCities.map((city) => ({
                  value: city,
                  label: city === "all" ? "Все города" : city,
                }))}
                value={cityFilter}
                onChange={setCityFilter}
                leftSection={<IconMapPin size={16} />}
              />

              <Select
                label="Компания"
                placeholder="Все компании"
                data={uniqueCompanies.map((company) => ({
                  value: company,
                  label: company === "all" ? "Все компании" : company,
                }))}
                value={companyFilter}
                onChange={setCompanyFilter}
                leftSection={<IconBuilding size={16} />}
              />

              <Select
                label="Зарплата"
                placeholder="Любая"
                data={salaryRanges}
                value={salaryFilter}
                onChange={setSalaryFilter}
                leftSection={<IconCurrencyRubel size={16} />}
              />

              <Select
                label="HR-специалист"
                placeholder="Все HR"
                data={uniqueHRs.map((hr) => ({
                  value: hr,
                  label: hr === "all" ? "Все HR" : hr,
                }))}
                value={hrFilter}
                onChange={setHrFilter}
              />

              <div>
                <Text size="sm" fw={500} mb={4}>
                  Период
                </Text>
                <Group gap="xs">
                  <DatePickerInput
                    placeholder="От"
                    value={dateFrom}
                    onChange={setDateFrom as any}
                    clearable
                    style={{ flex: 1 }}
                  />
                  <Text c="dimmed">—</Text>
                  <DatePickerInput
                    placeholder="До"
                    value={dateTo}
                    onChange={setDateTo as any}
                    clearable
                    style={{ flex: 1 }}
                  />
                </Group>
              </div>
            </SimpleGrid>
          </Stack>
        </Paper>

        {/* Статистика */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card padding="md" radius="md" withBorder>
            <Group>
              <ThemeIcon size="xl" radius="md" color="orange" variant="light">
                <IconClock size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  На модерации
                </Text>
                <Group gap={4}>
                  <Text size="xl" fw={700}>
                    {filteredStats.pending}
                  </Text>
                  {hasActiveFilters &&
                    stats.pending !== filteredStats.pending && (
                      <Text size="sm" c="dimmed">
                        / {stats.pending}
                      </Text>
                    )}
                </Group>
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
                <Group gap={4}>
                  <Text size="xl" fw={700}>
                    {filteredStats.approved}
                  </Text>
                  {hasActiveFilters &&
                    stats.approved !== filteredStats.approved && (
                      <Text size="sm" c="dimmed">
                        / {stats.approved}
                      </Text>
                    )}
                </Group>
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
                <Group gap={4}>
                  <Text size="xl" fw={700}>
                    {filteredStats.rejected}
                  </Text>
                  {hasActiveFilters &&
                    stats.rejected !== filteredStats.rejected && (
                      <Text size="sm" c="dimmed">
                        / {stats.rejected}
                      </Text>
                    )}
                </Group>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Канбан-доска */}
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
            minHeight: "600px",
          }}
        >
          {columns.map((column) => {
            const columnVacancies = getVacanciesByStatus(column.id);
            return (
              <Paper
                key={column.id}
                p="md"
                radius="md"
                withBorder
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Group justify="space-between" mb="md">
                  <Group gap="xs">
                    <ThemeIcon
                      size="sm"
                      radius="xl"
                      color={column.color}
                      variant="filled"
                    >
                      {column.id === "pending" && <IconClock size={16} />}
                      {column.id === "approved" && <IconCheck size={16} />}
                      {column.id === "rejected" && <IconX size={16} />}
                    </ThemeIcon>
                    <Text fw={600} size="sm">
                      {column.title}
                    </Text>
                    <Badge color={column.color} variant="light" size="sm">
                      {columnVacancies.length}
                    </Badge>
                  </Group>

                  {/* Кнопка сворачивания (только на мобильных) */}
                  <ActionIcon
                    variant="subtle"
                    color={column.color}
                    onClick={() => toggleColumn(column.id)}
                    hiddenFrom="md"
                  >
                    {collapsedColumns[column.id] ? (
                      <IconChevronDown size={18} />
                    ) : (
                      <IconChevronUp size={18} />
                    )}
                  </ActionIcon>
                </Group>

                <Divider mb="md" />

                {/* Контент колонки - сворачиваемый на мобильных */}
                {!collapsedColumns[column.id] && (
                  <ScrollArea style={{ flex: 1 }}>
                    <Stack gap="sm">
                      {columnVacancies.map((vacancy) => (
                        <Card
                          key={vacancy.id}
                          p="md"
                          radius="md"
                          withBorder
                          shadow="sm"
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              boxShadow: "md",
                            },
                          }}
                        >
                          <Stack gap="xs">
                            <Group justify="space-between" align="flex-start">
                              <Text fw={600} size="sm" style={{ flex: 1 }}>
                                {vacancy.title}
                              </Text>
                              <ActionIcon
                                variant="light"
                                color="red"
                                size="sm"
                                onClick={() => handleViewDetails(vacancy)}
                              >
                                <IconEye size={16} />
                              </ActionIcon>
                            </Group>

                            <Group gap="xs">
                              <IconBuilding size={14} />
                              <Text size="xs" c="dimmed">
                                {vacancy.company}
                              </Text>
                            </Group>

                            <Group gap="xs">
                              <IconMapPin size={14} />
                              <Text size="xs" c="dimmed">
                                {vacancy.location}
                              </Text>
                            </Group>

                            <Group gap="xs">
                              <IconCurrencyRubel size={14} />
                              <Text size="xs" c="dimmed">
                                {vacancy.salary}
                              </Text>
                            </Group>

                            <Text size="xs" c="dimmed">
                              {vacancy.createdAt}
                            </Text>

                            {vacancy.moderatorComment && (
                              <Paper p="xs" bg="gray.0" radius="sm">
                                <Text size="xs" c="dimmed">
                                  💬 {vacancy.moderatorComment}
                                </Text>
                              </Paper>
                            )}

                            <Divider my="xs" />

                            {column.id === "pending" && (
                              <Group gap="xs">
                                <Button
                                  size="xs"
                                  color="green"
                                  fullWidth
                                  leftSection={<IconCheck size={14} />}
                                  onClick={() => handleQuickApprove(vacancy)}
                                >
                                  Одобрить
                                </Button>
                                <Button
                                  size="xs"
                                  color="red"
                                  variant="light"
                                  fullWidth
                                  leftSection={<IconX size={14} />}
                                  onClick={() => handleOpenReject(vacancy)}
                                >
                                  Отклонить
                                </Button>
                              </Group>
                            )}

                            {column.id === "approved" && (
                              <Button
                                size="xs"
                                color="red"
                                variant="light"
                                fullWidth
                                leftSection={<IconX size={14} />}
                                onClick={() => handleOpenReject(vacancy)}
                              >
                                Отклонить
                              </Button>
                            )}

                            {column.id === "rejected" && (
                              <Button
                                size="xs"
                                color="green"
                                variant="light"
                                fullWidth
                                leftSection={<IconCheck size={14} />}
                                onClick={() => handleOpenApprove(vacancy)}
                              >
                                Одобрить
                              </Button>
                            )}
                          </Stack>
                        </Card>
                      ))}

                      {columnVacancies.length === 0 && (
                        <Stack align="center" py="xl">
                          <IconAlertCircle size={32} color="gray" />
                          <Text size="sm" c="dimmed">
                            Пусто
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  </ScrollArea>
                )}

                {/* Компактный вид когда свернуто */}
                {collapsedColumns[column.id] && (
                  <Stack align="center" py="md">
                    <ThemeIcon
                      size="lg"
                      radius="xl"
                      color={column.color}
                      variant="light"
                    >
                      {column.id === "pending" && <IconClock size={24} />}
                      {column.id === "approved" && <IconCheck size={24} />}
                      {column.id === "rejected" && <IconX size={24} />}
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" ta="center">
                      Свернуто
                    </Text>
                  </Stack>
                )}
              </Paper>
            );
          })}
        </Box>
      </Stack>

      {/* Модальное окно детальной информации */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title="Детали вакансии"
        size="lg"
      >
        {selectedVacancy && (
          <Stack>
            <div>
              <Text size="lg" fw={600}>
                {selectedVacancy.title}
              </Text>
              <Text c="dimmed">{selectedVacancy.company}</Text>
            </div>

            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" c="dimmed">
                  Отдел
                </Text>
                <Text>{selectedVacancy.department}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Локация
                </Text>
                <Text>{selectedVacancy.location}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Зарплата
                </Text>
                <Text>{selectedVacancy.salary}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  HR
                </Text>
                <Text>{selectedVacancy.hrName}</Text>
              </div>
            </SimpleGrid>

            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Описание
              </Text>
              <Text>{selectedVacancy.description}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Требования
              </Text>
              <Text>{selectedVacancy.requirements}</Text>
            </div>

            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" c="dimmed">
                  Email
                </Text>
                <Text size="sm">{selectedVacancy.contactEmail}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Телефон
                </Text>
                <Text size="sm">{selectedVacancy.contactPhone}</Text>
              </div>
            </SimpleGrid>

            {selectedVacancy.status === "pending" && (
              <Group mt="md">
                <Button
                  color="green"
                  leftSection={<IconCheck size={18} />}
                  onClick={() => {
                    handleQuickApprove(selectedVacancy);
                    closeDetails();
                  }}
                >
                  Одобрить
                </Button>
                <Button
                  color="red"
                  variant="light"
                  leftSection={<IconX size={18} />}
                  onClick={() => {
                    closeDetails();
                    handleOpenReject(selectedVacancy);
                  }}
                >
                  Отклонить
                </Button>
              </Group>
            )}
          </Stack>
        )}
      </Modal>

      {/* Модальное окно действия с комментарием */}
      <Modal
        opened={actionOpened}
        onClose={closeAction}
        title={
          action === "approve" ? "Одобрить вакансию" : "Отклонить вакансию"
        }
      >
        {selectedVacancy && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <div>
                <Text fw={500}>{selectedVacancy.title}</Text>
                <Text size="sm" c="dimmed">
                  {selectedVacancy.company}
                </Text>
              </div>

              <Textarea
                label={
                  action === "approve"
                    ? "Комментарий (опционально)"
                    : "Причина отклонения"
                }
                placeholder={
                  action === "approve"
                    ? "Дополнительные комментарии..."
                    : "Укажите причину отклонения..."
                }
                minRows={3}
                required={action === "reject"}
                {...form.getInputProps("comment")}
              />

              <Group justify="flex-end">
                <Button variant="light" onClick={closeAction}>
                  Отмена
                </Button>
                <Button
                  type="submit"
                  color={action === "approve" ? "green" : "red"}
                >
                  {action === "approve" ? "Одобрить" : "Отклонить"}
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Modal>
    </AppShell>
  );
}
