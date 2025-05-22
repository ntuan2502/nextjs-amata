"use client";
import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
// import {
//   Activity,
//   ChevronDown,
//   Flash,
//   Lock,
//   Scale,
//   Server,
//   TagUser,
// } from "../icons";
import {
  ACCOUNT_ROUTES,
  ADMIN_ROUTES,
  AUTH_ROUTES,
  HOME_ROUTE,
} from "@/constants/routes";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import LanguageSwitcher from "../language/LanguageSwitcher";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { useAuth } from "@/contexts/auth/useAuth";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function NavbarComponent() {
  const { tCta, tAdmin } = useAppTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  // const icons = {
  //   chevron: <ChevronDown fill="currentColor" size={16} />,
  //   scale: <Scale className="text-warning" fill="currentColor" size={30} />,
  //   lock: <Lock className="text-success" fill="currentColor" size={30} />,
  //   activity: (
  //     <Activity className="text-secondary" fill="currentColor" size={30} />
  //   ),
  //   flash: <Flash className="text-primary" fill="currentColor" size={30} />,
  //   server: <Server className="text-success" fill="currentColor" size={30} />,
  //   user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  // };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href={HOME_ROUTE}>
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link href={HOME_ROUTE}>
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          </Link>
        </NavbarBrand>
        {/* <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
              >
                Features
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="ACME features"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                key="autoscaling"
                description="ACME scales apps based on demand and load"
                startContent={icons.scale}
              >
                Autoscaling
              </DropdownItem>
              <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues"
                startContent={icons.activity}
              >
                Usage Metrics
              </DropdownItem>
              <DropdownItem
                key="production_ready"
                description="ACME runs on ACME, join us at web scale"
                startContent={icons.flash}
              >
                Production Ready
              </DropdownItem>
              <DropdownItem
                key="99_uptime"
                description="High availability and uptime guarantees"
                startContent={icons.server}
              >
                +99% Uptime
              </DropdownItem>
              <DropdownItem
                key="supreme_support"
                description="Support team ready to respond"
                startContent={icons.user}
              >
                +Supreme Support
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem> */}
        {/* <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem> */}
      </NavbarContent>

      <NavbarContent justify="end">
        {!user ? (
          <>
            <NavbarItem className="">
              <Link href={AUTH_ROUTES.LOGIN}>{tCta("signIn")}</Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="warning" href={AUTH_ROUTES.REGISTER}>
                {tCta("signUp")}
              </Link>
            </NavbarItem>
          </>
        ) : (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              {user.avatar ? (
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src={user.avatar}
                />
              ) : (
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={avatarInitial}
                  size="sm"
                >
                  {avatarInitial}
                </Avatar>
              )}
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="info" textValue="info" className="h-fit gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
                <p className="">{user.name}</p>
              </DropdownItem>

              <DropdownItem
                key="profile"
                textValue="profile"
                onPress={() => router.push(ACCOUNT_ROUTES.PROFILE)}
              >
                {tCta("profile")}
              </DropdownItem>
              <DropdownItem
                key="admin"
                textValue="admin"
                onPress={() => router.push(ADMIN_ROUTES.DASHBOARD)}
              >
                {tAdmin("dashboard")}
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                textValue="logout"
                onPress={logout}
              >
                {tCta("logout")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}

        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem key="profile">
          <Link
            className="w-full"
            color="foreground"
            href={ACCOUNT_ROUTES.PROFILE}
            size="lg"
          >
            {tCta("profile")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="dashboard">
          <Link
            className="w-full"
            color="foreground"
            href={ADMIN_ROUTES.DASHBOARD}
            size="lg"
          >
            {tAdmin("dashboard")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="logout">
          <Link
            className="w-full"
            color="danger"
            href="#"
            size="lg"
            onPress={logout}
          >
            {tCta("logout")}
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
