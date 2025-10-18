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
} from "@tabler/icons-react";
import { AreaChart } from "@mantine/charts";

// Мок-данные для демонстрации
const stats = [
  {
    title: "Активных вакансий",
    value: "24",
    diff: "+12%",
    icon: IconBriefcase,
    color: "blue",
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
              { name: "candidates", label: "Кандидаты", color: "blue.6" },
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
        </Stack>
      </AppShell>
    </ProtectedRoute>
  );
}
