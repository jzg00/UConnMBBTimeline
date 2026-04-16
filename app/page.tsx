import HomeClient from "@/components/HomeClient";
import { seasons } from "@/data/seasons";

export default function Home() {
  return <HomeClient seasons={seasons} />;
}
