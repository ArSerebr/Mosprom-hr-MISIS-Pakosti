"use client";

import { AppShell } from "@/components/AppShell/AppShell";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Grid,
  Paper,
  Text,
  Group,
  Badge,
  Stack,
  Card,
  Title,
  SimpleGrid,
  Progress,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconBriefcase,
  IconUsers,
  IconSchool,
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconClock,
  IconBuilding,
  IconTrophy,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import { AreaChart } from "@mantine/charts";

// Мок-данные для демонстрации
const stats = [
  {
    title: "Активных вакансий",
    value: "24",
    diff: "+12%",
    icon: IconBriefcase,
    color: "red",
    trend: "up",
  },
  {
    title: "Новых кандидатов",
    value: "156",
    diff: "+23%",
    icon: IconUsers,
    color: "teal",
    trend: "up",
  },
  {
    title: "Стажировок",
    value: "8",
    diff: "-5%",
    icon: IconSchool,
    color: "violet",
    trend: "down",
  },
  {
    title: "Нанято в этом месяце",
    value: "12",
    diff: "+8%",
    icon: IconCheck,
    color: "green",
    trend: "up",
  },
];

const chartData = [
  { month: "Янв", candidates: 120, hired: 8 },
  { month: "Фев", candidates: 145, hired: 12 },
  { month: "Мар", candidates: 132, hired: 9 },
  { month: "Апр", candidates: 168, hired: 15 },
  { month: "Май", candidates: 156, hired: 12 },
  { month: "Июн", candidates: 190, hired: 18 },
];

const recentVacancies = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    candidates: 23,
    status: "active",
  },
  { id: 2, title: "Product Manager", candidates: 45, status: "active" },
  { id: 3, title: "UX/UI Designer", candidates: 18, status: "active" },
  { id: 4, title: "Backend Developer", candidates: 31, status: "paused" },
  { id: 5, title: "Data Analyst", candidates: 12, status: "active" },
];

const recentCandidates = [
  {
    id: 1,
    name: "Алексей Иванов",
    position: "Frontend Developer",
    status: "interview",
  },
  {
    id: 2,
    name: "Мария Петрова",
    position: "Product Manager",
    status: "offer",
  },
  { id: 3, name: "Дмитрий Сидоров", position: "UX Designer", status: "new" },
  {
    id: 4,
    name: "Екатерина Смирнова",
    position: "Backend Developer",
    status: "interview",
  },
  { id: 5, name: "Иван Кузнецов", position: "Data Analyst", status: "new" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "green",
    paused: "yellow",
    closed: "gray",
    new: "blue",
    interview: "orange",
    offer: "teal",
    rejected: "red",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Активна",
    paused: "На паузе",
    closed: "Закрыта",
    new: "Новый",
    interview: "Интервью",
    offer: "Оффер",
    rejected: "Отказ",
  };
  return labels[status] || status;
};

// Дополнительные метрики
const additionalStats = [
  {
    title: "Отказы (не нанятые)",
    value: "47",
    diff: "+15%",
    icon: IconX,
    color: "red",
    trend: "up",
  },
  {
    title: "Активных компаний",
    value: "23",
    diff: "+3",
    icon: IconBuilding,
    color: "blue",
    trend: "up",
  },
  {
    title: "Партнерских вузов",
    value: "8",
    diff: "+1",
    icon: IconSchool,
    color: "violet",
    trend: "up",
  },
];

// Топ активных работодателей
const topEmployers = [
  { name: "Яндекс", vacancies: 12, hired: 8, rating: 4.8 },
  { name: "Сбер", vacancies: 15, hired: 11, rating: 4.7 },
  { name: "Mail.ru Group", vacancies: 8, hired: 6, rating: 4.6 },
  { name: "Тинькофф", vacancies: 10, hired: 7, rating: 4.5 },
  { name: "Ozon", vacancies: 7, hired: 5, rating: 4.4 },
];

// Топ активных вузов (Московские)
const topUniversities = [
  { name: "МГУ им. М.В. Ломоносова", students: 45, hired: 12, rating: 4.9 },
  { name: "МФТИ", students: 38, hired: 15, rating: 4.8 },
  { name: "МГТУ им. Н.Э. Баумана", students: 42, hired: 10, rating: 4.7 },
  { name: "НИУ ВШЭ", students: 35, hired: 9, rating: 4.6 },
  { name: "МИФИ", students: 28, hired: 8, rating: 4.5 },
  { name: "РЭУ им. Г.В. Плеханова", students: 32, hired: 7, rating: 4.4 },
  { name: "МАИ", students: 25, hired: 6, rating: 4.3 },
  { name: "МИРЭА", students: 22, hired: 5, rating: 4.2 },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Stack gap="lg">
          <Title order={1}>Дашборд</Title>

        {/* Статистика */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {stats.map((stat) => (
            <Paper key={stat.title} p="md" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text size="xl" fw={700} mt="xs">
                    {stat.value}
                  </Text>
                </div>
                <ThemeIcon
                  size="xl"
                  radius="md"
                  color={stat.color}
                  variant="light"
                >
                  <stat.icon size={28} stroke={1.5} />
                </ThemeIcon>
              </Group>
              <Group mt="md" gap="xs">
                {stat.trend === "up" ? (
                  <IconTrendingUp size={16} color="teal" />
                ) : (
                  <IconTrendingDown size={16} color="red" />
                )}
                <Text
                  size="sm"
                  c={stat.trend === "up" ? "teal" : "red"}
                  fw={500}
                >
                  {stat.diff}
                </Text>
                <Text size="sm" c="dimmed">
                  за месяц
                </Text>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        {/* График */}
        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">
            Статистика за последние 6 месяцев
          </Title>
          <AreaChart
            h={300}
            data={chartData}
            dataKey="month"
            series={[
              { name: "candidates", label: "Кандидаты", color: "red.6" },
              { name: "hired", label: "Нанято", color: "teal.6" },
            ]}
            curveType="natural"
            tickLine="xy"
            gridAxis="xy"
          />
        </Paper>

        {/* Вакансии и кандидаты */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Последние вакансии</Title>
                <Badge size="lg" variant="light">
                  {recentVacancies.length}
                </Badge>
              </Group>
              <Stack gap="md">
                {recentVacancies.map((vacancy) => (
                  <Paper key={vacancy.id} p="sm" radius="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>{vacancy.title}</Text>
                      <Badge
                        color={getStatusColor(vacancy.status)}
                        variant="light"
                      >
                        {getStatusLabel(vacancy.status)}
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <IconUsers size={16} />
                      <Text size="sm" c="dimmed">
                        {vacancy.candidates} кандидатов
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Недавние кандидаты</Title>
                <Badge size="lg" variant="light">
                  {recentCandidates.length}
                </Badge>
              </Group>
              <Stack gap="md">
                {recentCandidates.map((candidate) => (
                  <Paper key={candidate.id} p="sm" radius="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                      <div>
                        <Text fw={500}>{candidate.name}</Text>
                        <Text size="sm" c="dimmed">
                          {candidate.position}
                        </Text>
                      </div>
                      <Badge
                        color={getStatusColor(candidate.status)}
                        variant="light"
                      >
                        {getStatusLabel(candidate.status)}
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Дополнительные метрики */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {additionalStats.map((stat) => (
            <Paper key={stat.title} p="md" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text size="xl" fw={700} mt="xs">
                    {stat.value}
                  </Text>
                </div>
                <ThemeIcon
                  size="xl"
                  radius="md"
                  color={stat.color}
                  variant="light"
                >
                  <stat.icon size={28} stroke={1.5} />
                </ThemeIcon>
              </Group>
              <Group mt="md" gap="xs">
                {stat.trend === "up" ? (
                  <IconTrendingUp size={16} color="teal" />
                ) : (
                  <IconTrendingDown size={16} color="red" />
                )}
                <Text
                  size="sm"
                  c={stat.trend === "up" ? "teal" : "red"}
                  fw={500}
                >
                  {stat.diff}
                </Text>
                <Text size="sm" c="dimmed">
                  за месяц
                </Text>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Топ работодателей и вузов */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Топ активных работодателей</Title>
                <ThemeIcon size="lg" color="blue" variant="light">
                  <IconTrophy size={20} />
                </ThemeIcon>
              </Group>
              <Stack gap="md">
                {topEmployers.map((employer, index) => (
                  <Paper key={employer.name} p="sm" radius="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Group gap="sm">
                        <ThemeIcon size="sm" color="blue" variant="light">
                          <Text size="xs" fw={700}>{index + 1}</Text>
                        </ThemeIcon>
                        <div>
                          <Text fw={500}>{employer.name}</Text>
                          <Text size="sm" c="dimmed">
                            {employer.vacancies} вакансий • {employer.hired} нанято
                          </Text>
                        </div>
                      </Group>
                      <Group gap="xs">
                        <IconStar size={16} color="orange" />
                        <Text fw={500}>{employer.rating}</Text>
                      </Group>
                    </Group>
                    <Progress 
                      value={(employer.hired / employer.vacancies) * 100} 
                      size="sm" 
                      color="blue"
                      mt="xs"
                    />
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Рейтинг вузов</Title>
                <ThemeIcon size="lg" color="violet" variant="light">
                  <IconSchool size={20} />
                </ThemeIcon>
              </Group>
              <Stack gap="md">
                {topUniversities.map((university, index) => (
                  <Paper key={university.name} p="sm" radius="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Group gap="sm">
                        <ThemeIcon size="sm" color="violet" variant="light">
                          <Text size="xs" fw={700}>{index + 1}</Text>
                        </ThemeIcon>
                        <div>
                          <Text fw={500} size="sm">{university.name}</Text>
                          <Text size="xs" c="dimmed">
                            {university.students} студентов • {university.hired} трудоустроено
                          </Text>
                        </div>
                      </Group>
                      <Group gap="xs">
                        <IconStar size={16} color="orange" />
                        <Text fw={500}>{university.rating}</Text>
                      </Group>
                    </Group>
                    <Progress 
                      value={(university.hired / university.students) * 100} 
                      size="sm" 
                      color="violet"
                      mt="xs"
                    />
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
        </Stack>
      </AppShell>
    </ProtectedRoute>
  );
}
