"use client";

import { useState } from "react";
import {
  AppShell as MantineAppShell,
  Burger,
  Group,
  Text,
  NavLink,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
  Avatar,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconBriefcase,
  IconSchool,
  IconUsers,
  IconSun,
  IconMoon,
  IconLogout,
  IconSettings,
  IconUser,
  IconCheckbox,
  IconWorld,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
}

const navigation = [
  { label: "Дашборд", icon: IconDashboard, href: "/" },
  { label: "Вакансии", icon: IconBriefcase, href: "/vacancies" },
  { label: "Стажировки", icon: IconSchool, href: "/internships" },
  { label: "Кандидаты", icon: IconUsers, href: "/candidates" },
  { label: "Модерация", icon: IconCheckbox, href: "/moderation" },
  { label: "Каталог вакансий", icon: IconWorld, href: "/public-vacancies" },
];

export function AppShell({ children }: AppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl" fw={700} c="blue">
              HR System
            </Text>
          </Group>

          <Group gap="xs">
            <Tooltip
              label={colorScheme === "dark" ? "Светлая тема" : "Темная тема"}
            >
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )}
              </ActionIcon>
            </Tooltip>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="default" size="lg">
                  <Avatar size="sm" radius="xl" color="blue">
                    HR
                  </Avatar>
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>HR Менеджер</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  Профиль
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Настройки
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<IconLogout size={14} />}>
                  Выйти
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <MantineAppShell.Section grow>
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={20} stroke={1.5} />}
              active={pathname === item.href}
              variant="filled"
              mb="xs"
            />
          ))}
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
