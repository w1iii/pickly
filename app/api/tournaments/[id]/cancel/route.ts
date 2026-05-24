import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (!tournament || tournament.organizer_id !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await supabase
    .from("tournaments")
    .update({ status: "cancelled" })
    .eq("id", id);

  revalidatePath(`/tournaments/${id}`);
  revalidatePath(`/tournaments/${id}/manage`);
  redirect(`/tournaments/${id}`);
}
