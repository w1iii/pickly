import { createClient } from "@/lib/supabase-server";
import { SEED_COURTS } from "@/lib/seed-courts";
import { revalidatePath } from "next/cache";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if courts already exist
  const { count } = await supabase
    .from("courts")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    return Response.json({ message: `Courts already seeded (${count} exist)`, count });
  }

  const courts = SEED_COURTS.map((court) => ({
    ...court,
    created_by: user.id,
  }));

  const { error } = await supabase.from("courts").insert(courts);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/courts");
  return Response.json({ message: `Seeded ${courts.length} courts` });
}
