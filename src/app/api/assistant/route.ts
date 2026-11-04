export async function POST() {
  return Response.json(
    { error: "Asisten AI belum diaktifkan." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
