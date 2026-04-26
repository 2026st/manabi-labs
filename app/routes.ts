import { createElement } from "react";
import { createBrowserRouter } from "react-router-dom";
import { PaperLayout, RootLayout } from "./root";
import HomeRoute from "./routes/home";
import ArticlesRoute from "./routes/articles";
import StudyRoute from "./routes/study";
import ArticleDetailRoute from "./routes/article.$id";
import ArticleEditRoute from "./routes/article.$id.edit";
import ArticleNewRoute from "./routes/article.new";
import StudyNewRoute from "./routes/study.new";
import SearchRoute from "./routes/search";

export const router = createBrowserRouter([
  {
    element: createElement(RootLayout),
    children: [
      { path: "/", element: createElement(HomeRoute) },
      { path: "/articles", element: createElement(ArticlesRoute) },
      { path: "/study", element: createElement(StudyRoute) },
      { path: "/search", element: createElement(SearchRoute) }
    ]
  },
  {
    element: createElement(PaperLayout),
    children: [
      { path: "/article/:id", element: createElement(ArticleDetailRoute) },
      { path: "/article/:id/edit", element: createElement(ArticleEditRoute) },
      { path: "/new", element: createElement(ArticleNewRoute) },
      { path: "/study/new", element: createElement(StudyNewRoute) }
    ]
  }
]);
