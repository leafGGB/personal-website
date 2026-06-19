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
])
