import { createBrowserRouter } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Home from "./pages/Home"
import Work from "./pages/Work"
import WorkDetail from "./pages/WorkDetail"
import Travel from "./pages/Travel"
import TravelDetail from "./pages/TravelDetail"
import Journal from "./pages/Journal"
import JournalDetail from "./pages/JournalDetail"
import About from "./pages/About"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import AdminLogin from "./pages/admin/Login"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/Dashboard"
import ProjectsList from "./pages/admin/ProjectsList"
import ProjectForm from "./pages/admin/ProjectForm"
import TravelList from "./pages/admin/TravelList"
import TravelForm from "./pages/admin/TravelForm"
import JournalList from "./pages/admin/JournalList"
import JournalForm from "./pages/admin/JournalForm"
import MessagesList from "./pages/admin/MessagesList"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "work", element: <Work /> },
      { path: "work/:slug", element: <WorkDetail /> },
      { path: "travel", element: <Travel /> },
      { path: "travel/:slug", element: <TravelDetail /> },
      { path: "journal", element: <Journal /> },
      { path: "journal/:slug", element: <JournalDetail /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "projects", element: <ProjectsList /> },
      { path: "projects/new", element: <ProjectForm /> },
      { path: "projects/:slug/edit", element: <ProjectForm /> },
      { path: "travel", element: <TravelList /> },
      { path: "travel/new", element: <TravelForm /> },
      { path: "travel/:slug/edit", element: <TravelForm /> },
      { path: "journal", element: <JournalList /> },
      { path: "journal/new", element: <JournalForm /> },
      { path: "journal/:slug/edit", element: <JournalForm /> },
      { path: "messages", element: <MessagesList /> },
    ],
  },
])

