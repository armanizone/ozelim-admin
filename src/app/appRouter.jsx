import { createBrowserRouter } from "react-router-dom";
import {
  About,
  Bids,
  CharityFund,
  Courses,
  Health,
  Home,
  News,
  OurTeam,
  Partners,
  Program,
  Resort,
  Resorts,
  Price,
  NotFound,
  Login,
  Withdraws,
  Users,
  MoneyFlow,
  Binary,
  Construct,
  Levels,
  AboutKz,
  CharityFundKz,
  HealthKz,
  OurTeamKz,
  NewsKz,
  ConstructKz,
  CoursesKz,
  PriceKz,
  PartnersKz,
  ProgramKz,
  HomeKz,
  Services,
  Replenish,
  Bonuses,
  Tester,
  ProfileCourses
} from "pages";
import { baseLayout } from "./layouts/baseLayout";
import { SwitchLayout } from "shared/ui";

const appRouter = createBrowserRouter([
  {
    element: baseLayout,
    children: [
      { path: "/", element: <SwitchLayout ru={<Home/>} kz={<HomeKz/>} /> },
      { path: "/insurance", element: <SwitchLayout ru={<CharityFund/>} kz={<CharityFundKz/>} /> },
      { path: "/bids", element: <Bids /> },
      { path: "/health", element: <SwitchLayout ru={<Health/>} kz={<HealthKz/>} /> },
      { path: "/our-team", element: <SwitchLayout ru={<OurTeam/>} kz={<OurTeamKz/>} /> },
      { path: "/news", element: <SwitchLayout ru={<News/>} kz={<NewsKz/>} /> },
      { path: "/partners", element: <SwitchLayout ru={<Partners/>} kz={<PartnersKz/>} /> },
      { path: "/price", element: <SwitchLayout ru={<Price/>} kz={<PriceKz/>} /> },
      { path: "/program", element: <SwitchLayout ru={<Program/>} kz={<ProgramKz/>} /> },
      { path: "/resort/:id", element: <Resort /> },
      { path: "/resorts", element: <Resorts /> },
      { path: "/courses", element: <SwitchLayout ru={<Courses/>} kz={<CoursesKz/>} /> },
      { path: "/about", element: <SwitchLayout ru={<About/>} kz={<AboutKz/>} /> },
      { path: "/login", element: <Login /> },
      { path: "/withdraws", element: <Withdraws /> },
      { path: "/users", element: <Users /> },
      { path: "/money-flow", element: <MoneyFlow /> },
      { path: "/binary", element: <Binary /> },
      { path: "/construct", element: <SwitchLayout ru={<Construct/>} kz={<ConstructKz/>} /> },
      { path: "/Levels", element: <Levels /> },
      { path: "/services", element: <Services /> },
      { path: "/replenish", element: <Replenish /> },
      { path: "/bonuses", element: <Bonuses /> },
      { path: "/tester", element: <Tester /> },
      { path: "/profile-courses", element: <ProfileCourses /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export { appRouter };
