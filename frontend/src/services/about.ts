import { fetcher } from "@/services/request";
import useSWR from "swr";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  class_name: string;
  description: string;
  avatar_url: string;
  github: string;
  qq: string;
  wechat: string;
  email: string;
  website: string;
  order: number;
}

interface Contributor {
  id: number;
  name: string;
  class_name: string;
  contribution_type: string;
  contribution_type_display: string;
  description: string;
  avatar: string;
  github: string;
  contributions: number;
}

export interface AboutData {
  team_members: TeamMember[];
  contributors: Contributor[];
}

export function useAboutData() {
  const { data, error } = useSWR<AboutData>("/api/about/", fetcher);
  
  return {
    aboutData: data,
    loading: !error && !data,
    error: error,
  };
}