import HomeShell from "@/app/home-shell";
import { getProjects } from "@/lib/projects";

export const revalidate = 300;

export default async function Home() {
  const projects = await getProjects();

  return <HomeShell projects={projects} />;
}
